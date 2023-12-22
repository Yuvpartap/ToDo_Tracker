from flask import Flask, render_template, jsonify, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///todo.db' # this is the path to the database. URI is a string that identifies a database 
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False # this is to turn off the tracking of modifications    
db = SQLAlchemy(app) # this is the database object, it is used to create the database

class Todo(db.Model): # this is the class that creates the database
    sno = db.Column(db.Integer, primary_key=True) # this is the id column
    text = db.Column(db.String(200), nullable = False ) # this is the text column

    def __repr__(self) -> str:
        return f"{self.sno} - {self.text}" # repr is a representation of the object, it is used to print the object in a readable format  

def create_tables():
    with app.app_context():
        db.create_all()

@app.route("/") 
def hello_world():
    # todo = Todo(text = "This is a todo") 
    # db.session.add(todo) 
    # db.session.commit()
    allTodo = Todo.query.all()
    return render_template("index.html", todos = allTodo)

@app.route("/show") # this is a decorator, it is a way to add functionality to an existing function
def products(): # this is a function, creates new page
    allTodo = Todo.query.all() # this is a query to get all the data from the database
    print(allTodo)
    return "Products page"

@app.route("/add_todo", methods=["POST"])
def add_todo():
    try:
        data = request.get_json()
        text = data["text"]

        todo = Todo(text=text)
        db.session.add(todo)
        db.session.commit()

        return jsonify({"success": True, "message": "Todo added successfully"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})

@app.route("/update_todo", methods=["POST"])
def update_todo():
    try:
        data = request.get_json()
        old_text = data["oldText"]
        new_text = data["newText"]

        todo_to_update = Todo.query.filter_by(text=old_text).first()
        todo_to_update.text = new_text
        db.session.commit()

        return jsonify({"success": True, "message": "Todo updated successfully"})
    except Exception as e:
        return jsonify({"success": False, "error": str(e)})


@app.route("/delete_todo", methods=["POST"])
def delete_todo():
    try:
        data = request.get_json()
        text = data["text"]

        print(f"Received request to delete todo: {text}")   

        todo_to_delete = Todo.query.filter_by(text=text).first()
        db.session.delete(todo_to_delete)
        db.session.commit()

        return jsonify({"success": True, "message": "Todo deleted successfully"})
    except Exception as e:
        print(f"Error deleting todo: {str(e)}")
        return jsonify({"success": False, "error": str(e)})


if __name__ == "__main__":
    app.run(debug=True, port = 5000) # debug=True is optional, but it will give you more information if something goes wrong, (calling the app)

# static files is used to upload files that is used directly  