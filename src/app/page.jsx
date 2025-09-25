'use client';

// import Link from 'next/link';

export default function RootPage(){
    return (
  <>
    <nav className="bg-yellow-300 text-black px-6 py-3 flex justify-between">
      <a href="/userpage" className="hover:underline">
        <h1 className="font-bold">ឆាយ សៀវឡាយ​ កាត់កញ្ជក់</h1>
      </a>
    </nav>

    <div className="flex justify-center mt-10">
      <a
        href="/userpage"
        className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition text-center"
      >
        ត្រលប់ទៅទំព័រដើម
      </a>
    </div>
  </>
);
 
}

