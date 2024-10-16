# Webpack Website Template

Template for Webpack with a basic css reset. Also includes ESLint and Babel.

## Installation

### Prerequisites

Ensure you have Node.js with npm installed.

### Steps to use

1. Install GitHub CLI: winget install --id GitHub.cli
   
2. Create a new project using the template with: gh repo create my-new-project --template https://github.com/bw-01/webpack-template.git --public --clone
   1. Change --public to --private if you want to create a private repo

3. Navigate to the project folder:
   cd my-new-project

4. Install dependencies by running setup-project.ps1 or executing the lines in that file if not using Windows.
   
5. Run a web server to view a project as you update it on http://localhost:8080/ with:
   npm run dev

6. Generate the distributables for a project with:
   npm run build
