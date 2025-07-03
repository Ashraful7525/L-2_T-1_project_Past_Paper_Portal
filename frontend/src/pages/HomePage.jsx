import React, { useState, useEffect } from 'react';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('hot');

  // Mock data for posts/papers
  const posts = [
    {
      id: 1,
      title: "CSE 2101 - Data Structures & Algorithms Final Exam 2023 - Detailed Solutions Included",
      department: "r/ComputerScience",
      author: "u/CodeMaster23",
      timeAgo: "3 hours ago",
      upvotes: 847,
      downvotes: 23,
      comments: 156,
      downloads: 2341,
      rating: 4.8,
      fileSize: "2.4 MB",
      isUpvoted: false,
      isDownvoted: false,
      isSaved: false,
      preview: "This exam covers advanced topics including AVL trees, graph algorithms, dynamic programming...",
      tags: ["Final", "Solutions", "2023", "Theory"]
    },
    {
      id: 2,
      title: "EEE 1201 - Circuit Analysis Midterm with Step-by-Step Solutions",
      department: "r/ElectricalEng",
      author: "u/CircuitGuru",
      timeAgo: "5 hours ago",
      upvotes: 623,
      downvotes: 12,
      comments: 89,
      downloads: 1876,
      rating: 4.6,
      fileSize: "1.8 MB",
      isUpvoted: true,
      isDownvoted: false,
      isSaved: true,
      preview: "Comprehensive midterm covering Kirchhoff's laws, nodal analysis, mesh analysis...",
      tags: ["Midterm", "Solutions", "KCL", "KVL"]
    },
    {
      id: 3,
      title: "ME 2301 - Thermodynamics Final 2022 - Professor Ahmad's Section",
      department: "r/MechanicalEng",
      author: "u/ThermoExpert",
      timeAgo: "8 hours ago",
      upvotes: 542,
      downvotes: 8,
      comments: 67,
      downloads: 1543,
      rating: 4.7,
      fileSize: "3.1 MB",
      isUpvoted: false,
      isDownvoted: false,
      isSaved: false,
      preview: "Covers entropy, enthalpy, thermodynamic cycles, and heat engines...",
      tags: ["Final", "2022", "Prof Ahmad", "Cycles"]
    },
    {
      id: 4,
      title: "BBA 3101 - Financial Management Quiz Collection (All Semesters)",
      department: "r/BusinessAdmin",
      author: "u/FinanceWiz",
      timeAgo: "12 hours ago",
      upvotes: 398,
      downvotes: 15,
      comments: 43,
      downloads: 967,
      rating: 4.4,
      fileSize: "1.2 MB",
      isUpvoted: false,
      isDownvoted: false,
      isSaved: false,
      preview: "Complete collection of quizzes covering financial ratios, capital budgeting...",
      tags: ["Quiz", "Collection", "Finance", "All Semesters"]
    },
    {
      id: 5,
      title: "CSE 3201 - Database Management System Final 2023 - URGENT HELP NEEDED",
      department: "r/ComputerScience",
      author: "u/DBStudent",
      timeAgo: "1 day ago",
      upvotes: 287,
      downvotes: 3,
      comments: 78,
      downloads: 1234,
      rating: 4.9,
      fileSize: "2.8 MB",
      isUpvoted: false,
      isDownvoted: false,
      isSaved: false,
      preview: "SQL queries, normalization, indexing, and transaction management questions...",
      tags: ["Final", "SQL", "Normalization", "Help"]
    }
  ];


  const [departments, setDepartments] = useState([]);
  const [deptLoading, setDeptLoading] = useState(true);
  const [deptError, setDeptError]     = useState(null);
  const [showMoreDepts, setShowMoreDepts] = useState(false);

  // ❶ fetch once on mount
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await fetch('/api/departments/popular');   // adjust base-URL if needed
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setDepartments(data);
      } catch (err) {
        setDeptError(err.message);
      } finally {
        setDeptLoading(false);
      }
    };
    fetchDepartments();
  }, []);

  const handleVote = (postId, voteType) => {
    console.log(`Voted ${voteType} on post ${postId}`);
  };

  const handleSave = (postId) => {
    console.log(`Saved post ${postId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-12">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">📚</span>
              </div>
              <span className="text-xl font-bold text-gray-900">PastPaperPortal</span>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
                <input
                  type="text"
                  placeholder="Search papers, departments, users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-full bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent focus:bg-white"
                />
              </div>
            </div>

            {/* User Actions */}
            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-gray-100 rounded">
                💬
              </button>
              <button className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-sm font-medium hover:bg-orange-600">
                Sign In
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex gap-6">
          {/* Main Feed */}
          <div className="flex-1 max-w-4xl">
            {/* Sort Tabs */}
            <div className="bg-white rounded-md mb-4 p-2 flex space-x-1">
              {['hot', 'new', 'top', 'rising'].map((sort) => (
                <button
                  key={sort}
                  onClick={() => setSortBy(sort)}
                  className={`px-4 py-2 rounded text-sm font-medium capitalize ${
                    sortBy === sort 
                      ? 'bg-orange-100 text-orange-600' 
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {sort === 'hot' && '🔥 '}
                  {sort === 'new' && '🕐 '}
                  {sort}
                </button>
              ))}
            </div>

            {/* Posts */}
            <div className="space-y-2">
              {posts.map((post) => (
                <div key={post.id} className="bg-white rounded-md hover:shadow-md transition-shadow">
                  <div className="flex">
                    {/* Voting */}
                    <div className="flex flex-col items-center p-2 bg-gray-50 rounded-l-md">
                      <button 
                        onClick={() => handleVote(post.id, 'up')}
                        className={`p-1 rounded hover:bg-gray-200 ${post.isUpvoted ? 'text-orange-500' : 'text-gray-400'}`}
                      >
                        ⬆️
                      </button>
                      <span className="text-sm font-bold text-gray-900 py-1">
                        {(post.upvotes - post.downvotes).toLocaleString()}
                      </span>
                      <button 
                        onClick={() => handleVote(post.id, 'down')}
                        className={`p-1 rounded hover:bg-gray-200 ${post.isDownvoted ? 'text-blue-500' : 'text-gray-400'}`}
                      >
                        ⬇️
                      </button>
                    </div>

                    {/* Content */}
                    <div className="flex-1 p-3">
                      {/* Post Header */}
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <span className="font-medium text-gray-900">{post.department}</span>
                        <span className="mx-1">•</span>
                        <span>Posted by {post.author}</span>
                        <span className="mx-1">•</span>
                        <span>{post.timeAgo}</span>
                      </div>

                      {/* Title */}
                      <h2 className="text-lg font-medium text-gray-900 mb-2 hover:text-orange-600 cursor-pointer">
                        {post.title}
                      </h2>

                      {/* Preview */}
                      <p className="text-sm text-gray-600 mb-3">{post.preview}</p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {post.tags.map((tag, index) => (
                          <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Stats Bar */}
                      <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-2">
                        <div className="flex items-center space-x-4">
                          <div className="flex items-center space-x-1">
                            <span>⬇️</span>
                            <span>{post.downloads.toLocaleString()}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>⭐</span>
                            <span>{post.rating}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <span>📄</span>
                            <span>{post.fileSize}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-100">
                            <span>💬</span>
                            <span>{post.comments}</span>
                          </button>
                          <button className="flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-100">
                            <span>📤</span>
                            <span>Share</span>
                          </button>
                          <button 
                            onClick={() => handleSave(post.id)}
                            className={`flex items-center space-x-1 px-2 py-1 rounded hover:bg-gray-100 ${post.isSaved ? 'text-orange-500' : ''}`}
                          >
                            <span>🔖</span>
                            <span>Save</span>
                          </button>
                          <button className="p-1 rounded hover:bg-gray-100">
                            <span>⋯</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div className="w-80 space-y-4">
            {/* Popular Departments */}
            <div className="bg-white rounded-md p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Popular Departments</h3>

              {deptLoading && (
                <p className="text-sm text-gray-500">Loading…</p>
              )}

              {deptError && (
                <p className="text-sm text-red-500">Error: {deptError}</p>
              )}

              {!deptLoading && !deptError && (
                <div className="space-y-2">
                  {departments.slice(0, showMoreDepts ? 12 : 6).map((dept) => (
                    <div
                      key={dept.name}
                      className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{dept.icon}</span>
                        <span className="text-sm font-medium text-gray-900">
                          {dept.name}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {Intl.NumberFormat().format(dept.posts)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <button 
                onClick={() => setShowMoreDepts(!showMoreDepts)}
                className="w-full mt-3 text-sm text-orange-600 hover:underline"
              >
                {showMoreDepts ? 'Show Less' : 'Show More'}
              </button>
            </div>


            {/* Quick Stats */}
            <div className="bg-white rounded-md p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Today's Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Papers uploaded</span>
                  <span className="text-sm font-medium">47</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total downloads</span>
                  <span className="text-sm font-medium">12.4k</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active users</span>
                  <span className="text-sm font-medium">2.1k</span>
                </div>
              </div>
            </div>

            {/* Upload Paper */}
            <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-md p-4 text-white">
              <h3 className="font-semibold mb-2">Share Your Papers</h3>
              <p className="text-sm text-orange-100 mb-3">Help fellow students by uploading your past papers and solutions.</p>
              <button className="w-full bg-white text-orange-600 py-2 rounded font-medium hover:bg-gray-100">
                Upload Paper
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;