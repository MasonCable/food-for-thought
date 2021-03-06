import express from 'express'
import sha512 from 'js-sha512'
import conn from '../db/conn'
import jwt from 'jsonwebtoken'
import config from 'config'

const router = express.Router()

router.post('/login', (req, res, next) => {
	const email = req.body.email
	const password = sha512(req.body.password).toString()

	const sql = `
		SELECT 
			id, name, email, location, phone, type, tax_id
		FROM 
			users 
		WHERE 
			email = ? 
		AND 
			password = ?
	`

	conn.query(sql, [email, password], (err, results, fields) => {
		if (results.length > 0) {
			const token = jwt.sign({
				"id":results[0].id,
				"name": results[0].name, 
				"email": email, 
				"location": results[0].location, 
				"phone": results[0].phone, 
				"type": results[0].type,
				"tax_id": results[0].tax_id}, 
				config.get('jwt.secret'))

			res.json({
				token: token
			})
		} else {
			res.status(401).json({
				message: 'Email or Password incorrect'
			})
		}
	})
})

router.post('/register', (req, res, next) => {
	console.log(req.body)
	const name = req.body.name
	const email = req.body.email
	const password = sha512(req.body.password).toString()
	const location = req.body.location
	const phone = req.body.phone
	const type = req.body.type
	const tax_id = req.body.tax_id

	const sql = `
		INSERT INTO 
			users (name, email, password, location, phone, type, tax_id)
		VALUES 
			(?, ?, ?, ?, ?, ?, ?)
	`

	conn.query(sql, [name, email, password, location, phone, type, tax_id], (err, results, fields) => {
		res.json({
			message: 'User created'
		})
	})
})

export default router