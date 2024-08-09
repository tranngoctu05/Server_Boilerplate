/**
 * @swagger
 * tags:
 *   name: Default
 *   description: Welcom to API
 */
/**
/**
 * @swagger
 * /:
 *   get:
 *     summary: Home Page
 *     description: Welcome to the home page of the API.
 *     tags:
 *       - Default
 *     responses:
 *       200:
 *         description: Home Page
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: Home Page
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Bad Request"
 *       404:
 *         description: Not Found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Not Found"
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: "Internal Server Error"
 */