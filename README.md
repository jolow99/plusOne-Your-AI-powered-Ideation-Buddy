# plusOne-Your-AI-powered-Ideation-Buddy

## Problem
With the rise of remote work and remote learning due to COVID-19, the use of online digital whiteboarding tools such as Miro, Mural or Jamboard amongst others have become increasingly common. These digital whiteboards are often used by teams as a shared space for brainstorming. 

The ease of creating ‘unlimited’ post-its on these digital whiteboards has made it extremely easy for any participant to contribute their ideas, at the expense of the whiteboards getting cluttered very quickly. This leads to information overload and a reduced capacity for creative thought.

In order to overcome this, workshop facilitators ‘manage the mess’ through categorisation and summarisation. This process involves looking through every post-it, creating appropriate categories, then moving every post-it to the relevant category. However, this process is currently done manually, making it time-consuming and prone-to-errors. 


## Solution
We are building an interface which integrates easily with digital whiteboarding tools. Using our tool, digital post-its can be automatically sorted into categories, with appropriate labels which summarise the content of the post-its within that category. Not only does this make it easy for users to manage the many different ideas, it also enables them to synthesise information through informative text labels. 

## How To Run on Local
Step 1: `git clone https://github.com/jolow99/plusOne-Your-AI-powered-Ideation-Buddy.git`

### Frontend
Step 2: `cd plus-one`

Step 3: `npm start`

### Backend
Step 4: `cd ../plus-one-backend`

Step 5: `flask run`

### Misc.
Step 6: Set up a developer Miro account and point the URL for your Miro plugin app to your frontend server

Step 7: Ensure the backend flask server is pointing to your backend server
