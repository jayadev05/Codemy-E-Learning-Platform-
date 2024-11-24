import { useState } from 'react'
import { Search, Star } from 'lucide-react'
import hero_img from '../../../assets/hero_img.png'
import course1 from '../../../assets/Course-1.png'
import course2 from '../../../assets/Course-2.png'
import course3 from '../../../assets/Course-3.png'
import logo from '../../../assets/logo_cap.png'
import cat1 from '../../../assets/cat-1.png'
import cat2 from '../../../assets/cat-2.png'
import cat3 from '../../../assets/cat-3.png'
import cat4 from '../../../assets/cat-4.png'
import cat5 from '../../../assets/cat-5.png'
import cat6 from '../../../assets/cat-6.png'
import cat7 from '../../../assets/cat-7.png'
import cat8 from '../../../assets/cat-8.png'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { selectUser } from '../../../redux/userSlice';



const categories = [
  { name: "Label", courses: "21,245", bgColor: "bg-blue-100",img:cat1 },
  { name: "Business", courses: "12,245", bgColor: "bg-green-100" ,img:cat2 },
  { name: "Finance & Accounting", courses: "32,245", bgColor: "bg-orange-100",img:cat3  },
  { name: "IT & Software", courses: "22,245", bgColor: "bg-red-100" ,img:cat4 },
  { name: "Lifestyle", courses: "15,245", bgColor: "bg-yellow-100" ,img:cat5 },
  { name: "Design", courses: "12,245", bgColor: "bg-purple-100" ,img:cat6 },
  { name: "Health & Fitness", courses: "8,245", bgColor: "bg-green-100",img:cat7  },
  { name: "Music", courses: "9,245", bgColor: "bg-blue-100",img:cat8  },
]

const courses = [
  { id: 1, title: "Machine Learning & Data Science Bootcamp", price: 1400, rating: 4.9, students: "285.7K", img: course1 },
  { id: 2, title: "The Complete Web Development Course", price: 1400, rating: 4.8, students: "185.7K", img: course2 },
  { id: 3, title: "Digital Marketing Masterclass", price: 1400, rating: 4.9, students: "225.7K", img: course3 },
  { id: 4, title: "Photography Fundamentals", price: 1400, rating: 4.7, students: "165.7K", img: course1 },
  { id: 5, title: "Business Analytics Certificate Program", price: 1400, rating: 4.8, students: "195.7K", img: course2 },
  { id: 6, title: "UI/UX Design Professional Certificate", price: 1400, rating: 4.9, students: "205.7K", img: course1 },
  { id: 7, title: "Digital Marketing Masterclass", price: 1700, rating: 4.9, students: "205.7K", img: course1 },
  { id: 8, title: "UI/UX Design Professional Certificate", price: 1400, rating: 4.5, students: "205.7K", img: course3 },
 
]

export default function Login() {
  const [searchQuery, setSearchQuery] = useState('')

  const navigate=useNavigate();
  const user = useSelector(selectUser);

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 bg-white border-b md:py-3">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center text-2xl font-semibold text-orange-500">
            <img src={logo} alt="Codemy Logo" width={30} height={30} className="mr-2" />
            Codemy
          </a>
          <div className="relative hidden md:block">
            <input
              type="text"
              placeholder="What do you want to learn..."
              className="w-[300px] pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search className="absolute top-2.5 left-3 text-gray-400" size={20} />
          </div>
        </div>

        {
          (!user)? (<div className="flex items-center gap-4">
            <button onClick={()=>navigate('/signup')} className="px-4 py-2 text-orange-500 rounded-md transition-colors hover:text-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500">
              Create Account
            </button>
            <button onClick={()=>navigate('/login')} className="px-4 py-2 text-white bg-orange-500 rounded-md transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500">
              Sign In
            </button>
          </div>
  ) : (<div className="flex items-center gap-4">

    <button  className="px-1 py-2  rounded-md ">
      <i class="ri-notification-2-line"></i>
      </button>
      <button  className="px-1 py-2 rounded-md ">
      <i class="ri-heart-line"></i>
      </button>
      <button  className="px-1 py-2  rounded-md ">
      <i class="ri-shopping-cart-line"></i>
      </button>
      <img className='h-8 w-8 rounded-full' src="user.profileImg" alt="" />
     
    </div>)
        }
       
        

        
      </nav>

      <main className="container mx-auto px-10 py-10">
        <section className="grid items-center gap-10 md:grid-cols-2 lg:gap-16">
          <div className="space-y-6">
            <h1 className="text-4xl font-bold md:text-5xl lg:text-6xl">
              Learn with an <span className="text-orange-500">Expert</span> anytime, anywhere
            </h1>
            <p className="text-lg text-gray-600">
              Our mission is to help people find the best course online and learn with experts anytime, anywhere.
            </p>
            <button onClick={()=>navigate('/signup')} className="px-6 py-3 text-white bg-orange-500 rounded-md transition-colors hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500">
              Create Account
            </button>
          </div>
          <div className="relative h-[400px] md:h-[500px]">
            <img
              src={hero_img}
              alt="Learning illustration"
              className="object-cover h-full w-full"
            />
          </div>
        </section>

        <section className="mt-16">
          <h2 className="mb-8 text-3xl font-bold text-center">Browse top categories</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
            {categories.map((category) => (
              <div
                key={category.name}
                className="p-4 transition-shadow bg-white border rounded-lg hover:shadow-lg focus-within:ring-2 focus-within:ring-orange-500"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${category.bgColor} rounded-lg flex items-center justify-center`}>
                    <img src={category.img} alt="" width={24} height={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold">{category.name}</h3>
                    <p className="text-sm text-gray-500">{category.courses} Courses</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-16">
          <h2 className="mb-8 text-3xl font-bold text-center">Best selling courses</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {courses.map((course) => (
              <div key={course.id} className="overflow-hidden w-[300px] ml-3 transition-shadow border rounded-lg hover:shadow-lg focus-within:ring-2 focus-within:ring-orange-500">
                <div className="relative h-[200px]">
                  <img
                    src={course.img}
                    alt={course.title}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-lg font-semibold text-orange-500">${course.price.toLocaleString()}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-5 h-5 text-yellow-400 fill-current" />
                      <span>{course.rating}</span>
                      <span className="text-sm text-gray-500">({course.students} students)</span>
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold line-clamp-2">{course.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}
