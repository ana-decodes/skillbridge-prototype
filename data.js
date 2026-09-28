// Demo data. Numbers are illustrative, not real market statistics.
const SKILLS = {
  'Python':{have:80,need:85,demand:90},
  'Java':{have:65,need:75,demand:70},
  'SQL':{have:70,need:80,demand:85},
  'Data Structures':{have:40,need:80,demand:95},
  'React':{have:30,need:75,demand:85},
  'Git':{have:20,need:70,demand:60},
  'REST APIs':{have:15,need:70,demand:75},
  'Cloud Computing':{have:20,need:70,demand:80}
};
const QUIZ = [
  {q:'Which data structure removes the most recently added item first?',o:['Queue','Stack','Tree','Graph'],a:1,skill:'Data Structures'},
  {q:'How fast is binary search on a sorted list of n items?',o:['O(n)','O(n²)','O(log n)','O(1)'],a:2,skill:'Data Structures'},
  {q:'What does a SQL JOIN do?',o:['Deletes rows','Combines rows from two tables','Sorts results','Creates an index'],a:1,skill:'SQL'},
  {q:'Which React hook holds state inside a component?',o:['useState','useFetch','useDOM','useLoop'],a:0,skill:'React'},
  {q:'A teammate keeps missing deadlines and it is slowing you down. What first?',o:['Ignore it','Talk to them openly and find out what is blocking them','Tell the manager right away','Stop working with them'],a:1,skill:null}
];
const COURSES = {
  'Data Structures':'Data Structures and Algorithms','React':'React from the ground up','Git':'Git and GitHub for teams',
  'REST APIs':'Building and calling REST APIs','Cloud Computing':'Cloud basics'
};
const JOBS = [
  {id:1,co:'TechNova',role:'Software Development Intern',city:'Pune / Remote',type:'Internship',mode:'Remote',pay:'₹25,000/mo',len:'6 months',skills:['Python','SQL','Git','React']},
  {id:2,co:'InnovateLabs',role:'Backend Development Intern',city:'Bengaluru',type:'Internship',mode:'On-site',pay:'₹22,000/mo',len:'6 months',skills:['Java','SQL','REST APIs']},
  {id:3,co:'DataWorks',role:'Data Analyst Intern',city:'Remote',type:'Internship',mode:'Remote',pay:'₹18,000/mo',len:'3 months',skills:['Python','SQL']},
  {id:4,co:'CloudNine',role:'Cloud Engineer (graduate)',city:'Hyderabad',type:'Full-time',mode:'On-site',pay:'₹7 LPA',len:'Permanent',skills:['Cloud Computing','Git','Python']},
  {id:5,co:'PixelForge',role:'Full Stack Developer',city:'Pune',type:'Full-time',mode:'On-site',pay:'₹8 LPA',len:'Permanent',skills:['React','REST APIs','SQL','Data Structures']}
];
const STAGES = ['Applied','Shortlisted','Interview','Selected'];
