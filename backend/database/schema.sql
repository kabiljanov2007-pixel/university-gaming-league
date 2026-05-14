-- University Gaming League 2026 — Database Schema

-- Disciplines
CREATE TABLE IF NOT EXISTS disciplines (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(50) UNIQUE NOT NULL,
  description TEXT,
  team_size INT DEFAULT 4,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Teams
CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  discipline_id INT REFERENCES disciplines(id) ON DELETE SET NULL,
  university VARCHAR(200) NOT NULL,
  captain_name VARCHAR(150) NOT NULL,
  captain_phone VARCHAR(30) NOT NULL,
  captain_telegram VARCHAR(100),
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Team members
CREATE TABLE IF NOT EXISTS team_members (
  id SERIAL PRIMARY KEY,
  team_id INT NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  name VARCHAR(150) NOT NULL,
  game_nickname VARCHAR(100) NOT NULL,
  student_id VARCHAR(50) NOT NULL,
  is_captain BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Admins
CREATE TABLE IF NOT EXISTS admins (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- News
CREATE TABLE IF NOT EXISTS news (
  id SERIAL PRIMARY KEY,
  title VARCHAR(300) UNIQUE NOT NULL,
  excerpt TEXT,
  content TEXT,
  tag VARCHAR(50) DEFAULT 'Новости',
  published BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Results / Match bracket
CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  discipline_id INT REFERENCES disciplines(id) ON DELETE CASCADE,
  stage VARCHAR(50) NOT NULL CHECK (stage IN ('group', 'semifinal', 'final')),
  group_name VARCHAR(10),
  team1_id INT REFERENCES teams(id) ON DELETE SET NULL,
  team2_id INT REFERENCES teams(id) ON DELETE SET NULL,
  score1 INT,
  score2 INT,
  winner_id INT REFERENCES teams(id) ON DELETE SET NULL,
  played_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed: disciplines
INSERT INTO disciplines (name, slug, description, team_size)
VALUES
  ('PUBG Mobile', 'pubg', 'Командный Battle Royale. Тактика и меткость решают всё.', 4),
  ('Free Fire', 'freefire', 'Динамичный Battle Royale с уникальными персонажами.', 4)
ON CONFLICT (slug) DO NOTHING;

-- Seed: news
INSERT INTO news (title, excerpt, content, tag, published) VALUES
(
  'Новый анонс: регистрация на University Gaming League 2026',
  'Регистрация команд открыта с 14 по 20 мая 2026 года.',
  'Официальный анонс турнира University Gaming League 2026.

Регистрация команд открыта с 14 по 20 мая 2026 года. Участвовать могут студенты и выпускники 11-го класса. Каждая команда состоит из 4 игроков.

Важные даты и время:
- 14–20 мая — приём заявок
- 22 мая, 09:30 — регистрация участников на месте
- 22 мая, 10:00 — начало турнира

Место проведения: Университет им. К.Ш. Токтоматова, большой актовый зал.

Победителей ждут дипломы, медали, кубки и специальная награда (Surprise).',
  'Анонс',
  TRUE
),
(
  'Правила и регламент турнира опубликованы',
  'Ознакомьтесь с полными правилами проведения матчей для PUBG Mobile и Free Fire на странице дисциплин.',
  'Полные правила проведения матчей для PUBG Mobile и Free Fire доступны на странице дисциплин. Участникам необходимо ознакомиться с ними до регистрации команды.

Ключевые требования:
- Участник должен быть студентом или выпускником 11-го класса
- Личный смартфон с установленной игрой обязателен
- Запрещено использование читов и модифицированных APK
- Уровень аккаунта — не ниже 20 (Free Fire) и 30 (PUBG Mobile)',
  'Официально',
  TRUE
),
(
  'Дата и место проведения подтверждены',
  'Турнир состоится 22 мая 2026 года в большом актовом зале Университета им. К.Ш. Токтоматова. Вход для зрителей свободный.',
  'Мы рады подтвердить дату и место проведения University Gaming League 2026!

Турнир состоится 22 мая 2026 года в большом актовом зале Университета им. К.Ш. Токтоматова.

Вход для зрителей — свободный. Приходите поддержать команды!

По всем вопросам: kabiljanov2007@gmail.com или +996 755 041 207.',
  'Анонс',
  TRUE
)
ON CONFLICT DO NOTHING;
