# Tigrinya-Duo – Product Brief (LLM Handoff)

Last updated: Sun Oct  5 04:32:00 PDT 2025

## Routes
- `/` → Home  
- `/levels` → Levels list → links to `/level/{id}`  
- `/level/{id}` → Lesson screen  
- `/wordbanks?level={id}` → Word bank matching (Left: English; Right: Tigrinya)  
- `/profile` → Placeholder for user profile  

---

## Data Fields (Authoritative)
Each level contains:
```js
{
  id: 1,
  title: 'Greetings',
  words: [
    { ti: 'ሰላም', latin: 'selam', en: 'Hello' },
    { ti: 'ከመይ ኣለኻ', latin: 'kemey alekha', en: 'How are you?' }
  ]
}
```

## Notes
- Lock next level until previous level completed.  
- Progress bar highlights green as lessons complete.  
- Future: Add audio field for pronunciation + user progress tracking (Supabase).  


