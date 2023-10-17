<Navbar expand="lg" style={{ backgroundColor: '#d8456b' }}>

            <div className="container">
              <Navbar.Brand href="home" style={{ fontFamily: 'cursive', fontSize: '30px', paddingRight: '845px' }}>MyPantry</Navbar.Brand>
              <Navbar.Toggle aria-controls="navbarSupportedContent" />
              <Navbar.Collapse id="navbarSupportedContent">
                <ul className="navbar-nav ml-auto" >
                  <li className="nav-item" >
                    <a className="nav-link active" style={{ fontWeight: 'bold', color: 'white' }} aria-current="page" href="adminhome">Home</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link " aria-current="page" href="adminprofile" style={{ color: 'white' }}>Profile</a>
                  </li>
                  <Dropdown >
                    <Dropdown.Toggle style={{ border: 'none', color: 'inherit', fontSize: 'inherit', color: 'white', backgroundColor: '#d8456b', paddingRight: '0px', paddingLeft: '0px', marginTop: '0px' }}><i className="fa fa-bell text-white"></i> {unreadCount > 0 && <span className="badge">{unreadCount}</span>}</Dropdown.Toggle>
                    <Dropdown.Menu style={{ left: 'auto', right: 20 }}>
                      {notifications && notifications.length > 0 ? (notifications.map((notification, index) => (
                        <Dropdown.Item key={index} onClick={() => handleNotificationClick(notification._id)}
                          href={`/userpage/report/${notification.reportId}`}>
                          {notification.message}
                        </Dropdown.Item>
                      ))
                      ) : (
                        <Dropdown.Item>No new notifications</Dropdown.Item>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                </ul>
              </Navbar.Collapse>
            </div>
          </Navbar>