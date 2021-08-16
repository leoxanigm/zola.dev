window.addEventListener('load', function() {
  let jobData;

  const mainContainer = document.querySelector('.main-container');
  const joblistContainer = document.querySelector('.job-list-container');
  const filterContainer = document.querySelector('.filter-container');
  const appliedFilters = [];

  fetch('./data.json')
    .then(resp => resp.json())
    .then(populateData);

  function populateData(data) {
    jobData = data;

    const doneIds = [];

    // List listings with new and featured tags first and add their repective
    // ids to doneIds array

    jobData.forEach(listing => {
      // First list new and featured listings
      if (
        listing.featured &&
        listing.new &&
        doneIds.indexOf(listing.id) === -1
      ) {
        let currentListingValues = Object.keys(listing).map(
          key => listing[key]
        );
        joblistContainer.innerHTML += jobListTemplate(...currentListingValues);
        doneIds.push(listing.id);
      }

      // Second list new lisings
      if (listing.new && doneIds.indexOf(listing.id) === -1) {
        let currentListingValues = Object.keys(listing).map(
          key => listing[key]
        );
        joblistContainer.innerHTML += jobListTemplate(...currentListingValues);
        doneIds.push(listing.id);
      }

      // Finally list all the remaining listings
      if (doneIds.indexOf(listing.id) === -1) {
        let currentListingValues = Object.keys(listing).map(
          key => listing[key]
        );
        joblistContainer.innerHTML += jobListTemplate(...currentListingValues);
        doneIds.push(listing.id);
      }
    });
  }

  function jobListTemplate(
    id,
    company,
    logo,
    newPost,
    featured,
    position,
    role,
    level,
    postedAt,
    contract,
    location,
    languages,
    tools
  ) {
    return `<div class="job-list ${newPost ? 'new' : ''} ${
      featured ? 'featured' : ''
    }" id="${id}">
              <img src="${logo}" alt="${company}" class="logo">
              <div class="list-discription-container">
                <div class="poster-details">
                  <p class="company">${company}</p>
                  <p class="status-new ${
                    newPost ? '' : 'display-none'
                  }">New!</p>
                  <p class="status-featured ${
                    featured ? '' : 'display-none'
                  }">Featured</p>
                </div>
                <a href="#" class="position"><h2>${position}</h2></a>
                <div class="list-meta">
                  <p class="posted-time">${postedAt}</p>
                  <p class="contract">${contract}</p>
                  <p class="location">${location}</p>
                </div>
              </div>
              <div class="list-category-container">
                ${
                  role
                    ? '<a href="#" class="category" data-role="role">' +
                      role +
                      '</a>'
                    : ''
                }
                ${
                  level
                    ? '<a href="#" class="category" data-role="level">' +
                      level +
                      '</a>'
                    : ''
                }
                ${
                  languages.length
                    ? languages
                        .map(lan => {
                          return (
                            '<a href="#" class="category" data-role="languages">' +
                            lan +
                            '</a>'
                          );
                        })
                        .join('')
                    : ''
                }
                ${
                  tools.length
                    ? tools
                        .map(tool => {
                          return (
                            '<a href="#" class="category" data-role="tools">' +
                            tool +
                            '</a>'
                          );
                        })
                        .join('')
                    : ''
                }
              </div>
            </div>`.trim();
  }

  function filterListings(e) {
    let clickedEl = e.target;

    if (clickedEl.nodeName === 'A') {
      e.preventDefault();
    }

    const jobLists = joblistContainer.querySelectorAll('.job-list');

    if (
      clickedEl.getAttribute('data-element-role') === 'clear-filters' &&
      clickedEl.classList.contains('clear')
    ) {
      jobLists.forEach(listing => {
        listing.style.display = 'none';
        listing.style.display = 'flex';
      });

      appliedFilters.splice(0, appliedFilters.length);
      filterContainer.style.display = 'none';

      while (filterContainer.querySelector('.filters').lastChild) {
        filterContainer
          .querySelector('.filters')
          .removeChild(filterContainer.querySelector('.filters').lastChild);
      }
    } else if (
      clickedEl.getAttributeNames().indexOf('data-role') > -1 &&
      clickedEl.classList.contains('category')
    ) {
      let txtContent = clickedEl.textContent;
      let dataRole = clickedEl.getAttribute('data-role');

      filterContainer.style.display = 'flex';

      if (
        !appliedFilters.some(filterObj => {
          return (
            filterObj.name === txtContent && filterObj.dataRole === dataRole
          );
        })
      ) {
        appliedFilters.push({
          name: txtContent,
          dataRole: dataRole
        });

        filterContainer.querySelector('.filters').innerHTML += `
        <div class="filter">
          <p class="category" data-role="${dataRole}">${txtContent}</p>
          <a href="#" class="close" title="Close">x</a>
        </div>
      `;
      }

      jobLists.forEach(listing => {
        listing.style.display = 'none';

        let listCategories = Array.from(listing.querySelectorAll('a.category'));

        if (
          appliedFilters.every(filterObj => {
            return listCategories.some(cat => {
              return (
                filterObj.name === cat.textContent &&
                filterObj.dataRole === cat.getAttribute('data-role')
              );
            });
          })
        ) {
          listing.style.display = 'flex';
        }
      });
    } else if (
      clickedEl.getAttribute('title') === 'Close' &&
      clickedEl.classList.contains('close')
    ) {
      let currentFilterContainer = clickedEl.parentNode;

      let txtContent = currentFilterContainer.querySelector('.category')
        .textContent;
      let dataRole = currentFilterContainer
        .querySelector('.category')
        .getAttribute('data-role');

      currentFilterContainer.parentNode.removeChild(currentFilterContainer);

      appliedFilters.forEach((filterObj, index) => {
        if (filterObj.name === txtContent && filterObj.dataRole === dataRole) {
          appliedFilters.splice(index, 1);
        }
      });

      jobLists.forEach(listing => {
        listing.style.display = 'none';

        let listCategories = Array.from(listing.querySelectorAll('a.category'));

        if (
          appliedFilters.every(filterObj => {
            return listCategories.some(cat => {
              return (
                filterObj.name === cat.textContent &&
                filterObj.dataRole === cat.getAttribute('data-role')
              );
            });
          })
        ) {
          listing.style.display = 'flex';
        }
      });

      if ( appliedFilters.length === 0 ) filterContainer.style.display = 'none';

    }

  }

  mainContainer.addEventListener('click', filterListings);
  
});
