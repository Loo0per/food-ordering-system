import { 
  Utensils, 
  Menu, 
  X, 
  User, 
  LogOut, 
  ChevronDown, 
  Settings, 
  ShoppingCart, 
  Package,
  LayoutDashboard,
  Store
} from "lucide-react"
import { useState, useContext, useRef, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { UserContext } from "../context/userContext"
import { toast } from 'react-hot-toast'

const formatName = (name) => {
  if (!name) return '';
  const firstName = name.split(' ')[0];
  return firstName.toUpperCase();
};

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()
  const { user, setUser } = useContext(UserContext)

  if (user && user.role === "deliveryAgent") {
    return null;
  }

  // Helper function to get home page based on user role
  const getHomePage = () => {
    if (!user) return "/";
    if (user.isAdmin) return "/admin";
    if (user.role === "restaurant") return "/restaurant-profile";
    return "/";
  };

  const handleLogout = async () => {
    try {
      // Remove token from localStorage
      localStorage.removeItem("token")
      
      // Update user context
      setUser(null)
      
      // Close dropdown menu
      setIsDropdownOpen(false)
      
      // Show success message (optional)
      toast.success('Logged out successfully')
      
      // Navigate to home page
      navigate('/', { replace: true })
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('Error logging out')
    }
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Replace the existing desktop auth buttons section with this:
  const renderDesktopAuth = () => (
    <div className="hidden md:flex items-center gap-6">
      {user ? (
        <>
          {!user.isAdmin && user.role !== "restaurant" && (
            <Link
              to="/cart"
              className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors p-2 hover:bg-orange-50 rounded-lg"
            >
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                <ShoppingCart className="h-4 w-4 text-orange-500" />
              </div>
            </Link>
          )}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 text-gray-600 hover:text-orange-500 transition-colors p-2 hover:bg-orange-50 rounded-lg"
            >
              <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                <User className="h-4 w-4 text-orange-500" />
              </div>
              <span className="text-sm font-medium">{formatName(user.name)}</span>
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg border border-orange-100 py-2 z-50">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-orange-500 hover:bg-orange-50"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Link>
                
                {/* Restaurant role specific link */}
                {user.role === "restaurant" && (
                  <Link
                    to="/restaurant-profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-orange-500 hover:bg-orange-50"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Store className="h-4 w-4" />
                    Restaurant Dashboard
                  </Link>
                )}
                
                {/* Regular user links */}
                {!user.isAdmin && user.role !== "restaurant" && (
                  <Link
                    to="/orders"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-orange-500 hover:bg-orange-50"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <Package className="h-4 w-4" />
                    My Orders
                  </Link>
                )}
                
                {/* Admin links */}
                {user.isAdmin && (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-orange-500 hover:bg-orange-50"
                    onClick={() => setIsDropdownOpen(false)}
                  >
                    <LayoutDashboard className="h-4 w-4" />
                    Dashboard
                  </Link>
                )}
                
                <Link
                  to="/settings"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-orange-500 hover:bg-orange-50"
                  onClick={() => setIsDropdownOpen(false)}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </Link>
                <div className="h-px bg-orange-100 my-2"></div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-orange-500 hover:bg-orange-50 w-full"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          <Link
            to="/login"
            className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors"
          >
            Sign In
          </Link>
          <Link
            to="/register"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-200 hover:shadow-orange-500/30 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            Get Started
          </Link>
        </>
      )}
    </div>
  )

  return (
    <header className="sticky top-0 z-50 w-full border-b border-orange-100 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        {/* Logo - Updated to use getHomePage function */}
        <div className="flex items-center gap-2">
          <Link 
            to={getHomePage()} 
            className="flex items-center gap-2 font-bold text-xl group"
          >
            <div className="p-1.5 rounded-lg bg-orange-100 group-hover:bg-orange-200 transition-colors">
              <Utensils className="h-6 w-6 text-orange-500" />
            </div>
            <span className="bg-gradient-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
            HomePlate
            </span>
          </Link>
        </div>

        {/* Desktop Navigation - Updated with Restaurants, About Us and Contact Us links */}
        <nav className="hidden md:flex gap-8">
          {["Home", "Features", "How It Works", "Restaurants", "About Us", "Contact Us"].map((item) => {
            if (item === "Home") {
              return (
                <Link
                  key={item}
                  to={getHomePage()}
                  className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
                >
                  {item}
                </Link>
              );
            } else if (item === "About Us") {
              return (
                <Link
                  key={item}
                  to="/about-us"
                  className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
                >
                  {item}
                </Link>
              );
            } else if (item === "Contact Us") {
              return (
                <Link
                  key={item}
                  to="/contact-us"
                  className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
                >
                  {item}
                </Link>
              );
            } else if (item === "Restaurants") {
              return (
                <Link
                  key={item}
                  to="/restaurants"
                  className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
                >
                  {item}
                </Link>
              );
            } else {
              return (
                <a
                  key={item}
                  href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                  className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors relative after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-orange-500 after:scale-x-0 hover:after:scale-x-100 after:transition-transform"
                >
                  {item}
                </a>
              );
            }
          })}
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="p-2 md:hidden rounded-lg hover:bg-orange-50"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? (
            <X className="h-6 w-6 text-orange-500" />
          ) : (
            <Menu className="h-6 w-6 text-orange-500" />
          )}
        </button>

        {/* Replace the existing desktop auth section with the new one */}
        {renderDesktopAuth()}

        {/* Update the mobile menu section for restaurant role */}
        {isMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-t border-orange-100 shadow-lg z-50">
            <div className="container mx-auto px-4 py-4 space-y-4">
              {/* Mobile Navigation */}
              <nav className="flex flex-col gap-4">
                {["Home", "Features", "How It Works", "Restaurants", "About Us", "Contact Us"].map((item) => {
                  if (item === "Home") {
                    return (
                      <Link
                        key={item}
                        to={getHomePage()}
                        onClick={() => setIsMenuOpen(false)}
                        className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors p-2 hover:bg-orange-50 rounded-lg"
                      >
                        {item}
                      </Link>
                    );
                  } else if (item === "About Us") {
                    return (
                      <Link
                        key={item}
                        to="/about-us"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors p-2 hover:bg-orange-50 rounded-lg"
                      >
                        {item}
                      </Link>
                    );
                  } else if (item === "Contact Us") {
                    return (
                      <Link
                        key={item}
                        to="/contact-us"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors p-2 hover:bg-orange-50 rounded-lg"
                      >
                        {item}
                      </Link>
                    );
                  } else if (item === "Restaurants") {
                    return (
                      <Link
                        key={item}
                        to="/restaurants"
                        onClick={() => setIsMenuOpen(false)}
                        className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors p-2 hover:bg-orange-50 rounded-lg"
                      >
                        {item}
                      </Link>
                    );
                  } else {
                    return (
                      <a
                        key={item}
                        href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                        onClick={() => setIsMenuOpen(false)}
                        className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors p-2 hover:bg-orange-50 rounded-lg"
                      >
                        {item}
                      </a>
                    );
                  }
                })}
              </nav>
              <div className="flex flex-col gap-4 pt-4 border-t border-orange-100">
                {user ? (
                  <>
                    {/* Restaurant role specific link for mobile */}
                    {user.role === "restaurant" && (
                      <Link
                        to="/restaurant-profile"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg"
                      >
                        <Store className="h-4 w-4" />
                        Restaurant Dashboard
                      </Link>
                    )}
                    
                    {/* Regular customer links */}
                    {!user.isAdmin && user.role !== "restaurant" && (
                      <>
                        <Link
                          to="/cart"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-2 p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Cart
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-2 p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg"
                        >
                          <Package className="h-4 w-4" />
                          My Orders
                        </Link>
                      </>
                    )}
                    
                    <Link
                      to="/profile"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    {user?.isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center gap-2 p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                    )}
                    <Link
                      to="/settings"
                      onClick={() => setIsMenuOpen(false)}
                      className="flex items-center gap-2 p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg"
                    >
                      <Settings className="h-4 w-4" />
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMenuOpen(false);
                      }}
                      className="flex items-center gap-2 p-2 text-gray-600 hover:text-orange-500 hover:bg-orange-50 rounded-lg w-full"
                    >
                      <LogOut className="h-4 w-4" />
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="text-sm font-medium text-gray-600 hover:text-orange-500 transition-colors p-2 hover:bg-orange-50 rounded-lg"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="inline-flex h-11 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-2 text-sm font-semibold text-white shadow-lg"
                    >
                      Get Started
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
