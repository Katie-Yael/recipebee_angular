CREATE TABLE IF NOT EXISTS `USERS` (
  `id` INTEGER NOT NULL AUTO_INCREMENT ,
  `email` VARCHAR(50) NULL DEFAULT NULL ,
  `fullName` VARCHAR(50) NULL DEFAULT NULL ,
  `username` VARCHAR(50) NULL DEFAULT NULL ,
  `password` VARCHAR(50) NULL DEFAULT NULL ,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  PRIMARY KEY (`id`) 
);

CREATE TABLE IF NOT EXISTS `BOOKS` (
  `id` INTEGER NOT NULL AUTO_INCREMENT ,
  `bookName` VARCHAR(50) NOT NULL ,
  `code` VARCHAR(5) NOT NULL , 
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  PRIMARY KEY (`id`) , 
  UNIQUE (`bookName`) , 
  UNIQUE (`code`)
);

CREATE TABLE IF NOT EXISTS `RECIPES` (
  `id` INTEGER NOT NULL AUTO_INCREMENT ,
  `attachment` LONGTEXT NULL DEFAULT NULL ,
  `createdAt` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ,
  `user_id` INTEGER NOT NULL ,
  `books_id` INTEGER NOT NULL  ,
  PRIMARY KEY (`id`) ,
  FOREIGN KEY (`user_id`) REFERENCES USERS(`id`) ,
  FOREIGN KEY (`books_id`) REFERENCES BOOKS(`id`)
);

CREATE TABLE IF NOT EXISTS `SAVED` (
  `id` INTEGER NOT NULL AUTO_INCREMENT ,
  `user_id` INTEGER NOT NULL ,
  PRIMARY KEY (`id`) ,
  FOREIGN KEY (`user_id`) REFERENCES USERS(`id`)
);

CREATE TABLE IF NOT EXISTS `TAGS` (
  `id` INTEGER NOT NULL AUTO_INCREMENT ,
  `name` VARCHAR(50) NULL DEFAULT NULL ,
  PRIMARY KEY (`id`)
);

CREATE TABLE IF NOT EXISTS `BOOKUSERS` (
  `id` INTEGER NOT NULL AUTO_INCREMENT ,
  `user_id` INTEGER NOT NULL ,
  `book_id` INTEGER NOT NULL ,
  PRIMARY KEY (`id`) ,
  FOREIGN KEY (`user_id`) REFERENCES USERS(`id`) ,
  FOREIGN KEY (`book_id`) REFERENCES BOOKS(`id`)
);

CREATE TABLE IF NOT EXISTS `SAVEDRECIPES` (
  `id` INTEGER NOT NULL AUTO_INCREMENT ,
  `saved_id` INTEGER NOT NULL ,
  `recipe_id` INTEGER NOT NULL ,
  PRIMARY KEY (`id`) ,
  FOREIGN KEY (`saved_id`) REFERENCES SAVED(`id`) ,
  FOREIGN KEY (`recipe_id`) REFERENCES RECIPES(`id`)
);

CREATE TABLE IF NOT EXISTS `TAGRECIPES` (
  `id` INTEGER NOT NULL AUTO_INCREMENT ,
  `tag_id` INTEGER NOT NULL ,
  `recipe_id` INTEGER NOT NULL ,
  PRIMARY KEY (`id`) ,
  FOREIGN KEY (`tag_id`) REFERENCES TAGS(`id`) ,
  FOREIGN KEY (`recipe_id`) REFERENCES RECIPES(`id`)
);
