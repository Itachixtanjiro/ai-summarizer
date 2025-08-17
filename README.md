# 📘 AI Summarizer MVP

An AI-powered summarization application built with **Next.js 14**, **Supabase**, **Groq AI API**, and **Resend**.  
The app allows users to input text or URLs, generate concise AI summaries, store history, and share results via email.

---

## 🚀 Features

- **Summarization** – Enter text or links and get clean, concise summaries using Groq AI.  
- **History Tracking** – Past summaries are stored in **Supabase** for easy retrieval.  
- **Sharing via Email** – Share summaries directly with others using **Resend API**.  
- **Modern UI** – Built with **React 18** and **TailwindCSS**, providing a sleek, responsive design.  

---

## 🛠 Tech Stack

### Frontend
- **Next.js 14** – Server-side rendering & API routes.  
- **React 18** – UI components.  
- **TailwindCSS** – Styling for responsive, modern UI.  

### Backend / APIs
- **Supabase** – Database for storing summaries & history.  
- **Groq API** – AI summarization engine.  
- **Resend API** – Transactional emails for sharing summaries.  

### Development Tools
- **ESLint + Prettier** – Code quality and consistency.  
- **PostCSS + Autoprefixer** – CSS optimization.  

---

## 📂 Project Structure

```
ai-summarizer/
│── lib/                  # Services & API clients
│   ├── superbaseClient.js
│   ├── groqService.js
│   ├── resendService.js
│── pages/
│   ├── index.js          # Main app page
│   ├── api/
│   │   ├── summarize.js  # Summarization API route
│   │   ├── share.js      # Email sharing API route
│   │   ├── [id].js       # Fetch saved summaries by ID
│── components/
│   ├── InputPanel.js     # User input section
│   ├── ResultPanel.js    # Display generated summaries
│   ├── HistoryPanel.js   # Past summaries
│── styles/
│   ├── global.css
│── schema.sql            # Supabase DB schema
│── package.json          # Dependencies
│── next.config.js        # Next.js config
```

---

## ⚙️ Setup & Installation

### 1️⃣ Clone the repository
```bash
git clone https://github.com/your-username/ai-summarizer.git
cd ai-summarizer
```

### 2️⃣ Install dependencies
```bash
npm install
```

### 3️⃣ Configure Environment Variables  
Create a `.env.local` file at the root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

GROQ_API_KEY=your_groq_api_key
RESEND_API_KEY=your_resend_api_key
```

### 4️⃣ Database Setup  
Run the schema file in Supabase:
```sql
-- schema.sql
CREATE TABLE summaries (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  input_text text,
  summary text,
  created_at timestamp DEFAULT now()
);
```

### 5️⃣ Start the app
```bash
npm run dev
```
Visit: [http://localhost:3000](http://localhost:3000)

---

## 🚢 Deployment

You can deploy easily on **Vercel**:

1. Push your code to GitHub.  
2. Go to [Vercel Dashboard](https://vercel.com/).  
3. Import your repo → Configure environment variables → Deploy.  

---

## 🔍 Process & Approach

1. **Summarization Pipeline**  
   - User enters text/URL → Sent to API (`/api/summarize`) → Groq API generates summary → Stored in Supabase.

2. **History Tracking**  
   - Each summary request is saved in Supabase with timestamp.  
   - `HistoryPanel.js` retrieves & displays summaries for user reference.  

3. **Sharing via Email**  
   - User selects a summary → Calls `/api/share` → Uses Resend API → Sends formatted email to recipient.  

4. **UI/UX**  
   - Clean three-panel layout: Input → Result → History.  
   - TailwindCSS for responsiveness and sleek design.  

---

## 📌 Future Enhancements

- Add **user authentication** (Supabase Auth).  
- Support **PDF/Doc uploads** for summarization.  
- Add **multi-language support**.  
- Enhance **email templates** for better presentation.  

---

## 🧑‍💻 Author

Built by **[Your Name]** 🚀  
Feel free to contribute or raise issues.  
