package models

import "time"

// About — singleton row
type About struct {
	ID        uint   `gorm:"primaryKey" json:"id"`
	Content   string `json:"content"`
	Tagline   string `json:"tagline"`   // newline-separated list of rotating tagline items
	Interests string `json:"interests"` // newline-separated list of interests
}

// Experience
type Experience struct {
	ID           uint   `gorm:"primaryKey" json:"id"`
	Title        string `json:"title"`
	Organization string `json:"organization"`
	LogoURL      string `json:"logo_url"`
	Type         string `json:"type"` // "professional" | "education"
	StartDate    string `json:"start_date"`
	EndDate      string `json:"end_date"` // "YYYY-MM" or "Present"
	Description  string `json:"description"`
	Order        int    `json:"order"`
}

// Writing
type Writing struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Title       string    `json:"title"`
	MediumURL   string    `json:"medium_url"`
	PublishedAt time.Time `json:"published_at"`
	CreatedAt   time.Time `json:"created_at"`
}

// Recommendation — submitted by visitors
type Recommendation struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Title     string    `json:"title"`
	Author    string    `json:"author"`
	Note      string    `json:"note"`  // optional "why I love it"
	From      string    `json:"from"`  // optional recommender name
	CreatedAt time.Time `json:"created_at"`
}

// Book
type Book struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	Title     string    `json:"title"`
	Author    string    `json:"author"`
	CoverURL  string    `json:"cover_url"`
	Status    string    `json:"status"` // "read" | "reading" | "will_read"
	CreatedAt time.Time `json:"created_at"`
}

// DrummingMedia — photos/videos for the masonry collage
type DrummingMedia struct {
	ID        uint      `gorm:"primaryKey" json:"id"`
	URL       string    `json:"url"`
	MediaType string    `json:"media_type"` // "photo" | "video"
	Caption   string    `json:"caption"`
	Order     int       `json:"order"`
	CreatedAt time.Time `json:"created_at"`
}

// Movie — personal movie recommendations
type Movie struct {
	ID          uint      `gorm:"primaryKey" json:"id"`
	Title       string    `json:"title"`
	Year        string    `json:"year"`
	Director    string    `json:"director"`
	Genre       string    `json:"genre"`
	Description string    `json:"description"`
	PosterURL   string    `json:"poster_url"`
	Order       int       `json:"order"`
	CreatedAt   time.Time `json:"created_at"`
}
