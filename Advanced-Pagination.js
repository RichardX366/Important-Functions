//Backend:
  const { limit, id, greaterThanId, ending, announcer } = data;
  const announcements = await Announcements.find({
    ...(announcer ? { announcer: announcer } : {}),
    ...(ending || !id
      ? {}
      : {
          _id: greaterThanId ? { $gt: id } : { $lt: id },
        }),
  })
    .sort(greaterThanId || ending ? {} : { _id: -1 })
    .limit(Number(limit))
    .lean();
  return {
    announcements: announcements,
    totalAnnouncements: await Announcements.countDocuments(
      announcer ? { announcer: announcer } : {}
    )
  };

//FrontEnd:
  const totalPages = Math.ceil(announcements?.totalAnnouncements / 5);
  const announcementPages = {
    async first() {
      try {
        const { data } = await AnnouncementService.getAnnouncements({
          announcer: globalUser.name.get(),
          limit: 5,
        });
        if (data.success) {
          setAnnouncements({ ...data.data, currentPage: 0 });
        } else {
          throw data.data;
        }
      } catch (e) {
        console.log(e);
      }
    },
    async back() {
      if (announcements.currentPage > 0) {
        try {
          const { data } = await AnnouncementService.getAnnouncements({
            announcer: globalUser.name.get(),
            limit: 5,
            id: announcements.announcements[0]._id,
            greaterThanId: true,
          });
          if (data.success) {
            data.data.announcements.reverse();
            setAnnouncements({
              ...data.data,
              currentPage: announcements.currentPage - 1,
            });
          } else {
            throw data.data;
          }
        } catch (e) {
          console.log(e);
        }
      }
    },
    async next() {
      if (announcements.currentPage < totalPages - 1) {
        try {
          const { data } = await AnnouncementService.getAnnouncements({
            announcer: globalUser.name.get(),
            limit: 5,
            id: announcements.announcements[
              announcements.announcements.length - 1
            ]._id,
          });
          if (data.success) {
            setAnnouncements({
              ...data.data,
              currentPage: announcements.currentPage + 1,
            });
          } else {
            throw data.data;
          }
        } catch (e) {
          console.log(e);
        }
      }
    },
    async last() {
      try {
        const { data } = await AnnouncementService.getAnnouncements({
          announcer: globalUser.name.get(),
          limit:
            announcements.totalAnnouncements % 5
              ? announcements.totalAnnouncements % 5
              : 5,
          ending: true,
        });
        if (data.success) {
          data.data.announcements.reverse();
          setAnnouncements({ ...data.data, currentPage: totalPages - 1 });
        } else {
          throw data.data;
        }
      } catch (e) {
        console.log(e);
      }
    },
  };
                <div className='bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6'>
                  <div className='hidden sm:flex-1 sm:flex sm:items-center sm:justify-between'>
                    <div>
                      <p className='text-sm text-gray-700'>
                        Showing
                        <span className='font-semibold'>
                          {' '}
                          {announcements?.currentPage * 5 + 1}{' '}
                        </span>
                        to
                        <span className='font-semibold'>
                          {' '}
                          {totalPages === announcements?.currentPage + 1
                            ? announcements?.totalAnnouncements
                            : announcements?.currentPage * 5 + 5}{' '}
                        </span>
                        of
                        <span className='font-semibold'>
                          {' '}
                          {announcements?.totalAnnouncements}{' '}
                        </span>
                        of your announcements
                      </p>
                    </div>
                    <div>
                      <nav
                        className='relative z-0 inline-flex rounded-md shadow-sm -space-x-px'
                        aria-label='Pagination'
                      >
                        <button
                          onClick={announcementPages.back}
                          className='relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'
                        >
                          <span className='sr-only'>Previous</span>
                          <ChevronLeftIcon className='h-5 w-5' />
                        </button>
                        <button
                          onClick={announcementPages.first}
                          className={`${
                            announcements?.currentPage === 0
                              ? 'z-1 bg-blue-50 border-blue-500 text-blue-600 cursor-default disabled'
                              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                          } relative inline-flex items-center px-4 py-2 border text-sm font-medium`}
                        >
                          1
                        </button>
                        {announcements?.currentPage > 2 ? (
                          <span className='relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700'>
                            ...
                          </span>
                        ) : null}
                        {announcements?.currentPage > 1 ? (
                          <button
                            onClick={announcementPages.back}
                            className='bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                          >
                            {announcements?.currentPage}
                          </button>
                        ) : null}
                        {announcements?.currentPage > 0 &&
                        announcements?.currentPage < totalPages - 1 ? (
                          <button className='z-1 bg-blue-50 border-blue-500 text-blue-600 cursor-default relative inline-flex items-center px-4 py-2 border text-sm font-medium'>
                            {announcements?.currentPage + 1}
                          </button>
                        ) : null}
                        {announcements?.currentPage < totalPages - 2 ? (
                          <button
                            onClick={announcementPages.next}
                            className='bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium'
                          >
                            {announcements?.currentPage + 2}
                          </button>
                        ) : null}
                        {totalPages > 2 &&
                        announcements?.currentPage < totalPages - 3 ? (
                          <span className='relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700'>
                            ...
                          </span>
                        ) : null}
                        {totalPages > 1 ? (
                          <button
                            onClick={announcementPages.last}
                            className={`${
                              announcements?.currentPage === totalPages - 1
                                ? 'z-1 bg-blue-50 border-blue-500 text-blue-600 cursor-default disabled'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 '
                            } relative inline-flex items-center px-4 py-2 border text-sm font-medium`}
                          >
                            {totalPages}
                          </button>
                        ) : null}
                        <button
                          onClick={announcementPages.next}
                          className='relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50'
                        >
                          <span className='sr-only'>Next</span>
                          <ChevronRightIcon className='h-5 w-5' />
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
