import os
from datetime import datetime, timedelta

# Kitne din ka graph bharna hai? (365 = 1 saal)
days = 280

for i in range(days):
    # Har din 8-10 commits taaki "Dark Green" dikhe
    for j in range(8):
        # Date calculate karo
        d = (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d %H:%M:%S')
        
        with open('hack.txt', 'a') as f:
            f.write(f'Commit on {d}\n')
        
        os.system('git add hack.txt')
        # Sabse zaroori line: Date ko force karna
        os.environ['GIT_AUTHOR_DATE'] = d
        os.environ['GIT_COMMITTER_DATE'] = d
        os.system(f'git commit -m "Update profile stats {i}-{j}" --quiet')

print("✅ Local commits ho gaye hain!")