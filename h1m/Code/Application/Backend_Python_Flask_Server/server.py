from flask import Flask, request, jsonify
from sqlalchemy import create_engine, exc
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, BigInteger, Integer, String, Date
from flask_cors import CORS, cross_origin
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

engine = create_engine('postgresql://postgres:root@localhost:5432/postgres')

Session = sessionmaker(bind=engine)

session = Session()

Base = declarative_base()

class User(Base):
    __tablename__ = 'Users'
    userid = Column(BigInteger, primary_key=True, nullable=False, autoincrement=True)
    email = Column(String, nullable=False)
    password = Column(String, nullable=False)
    firstname = Column(String, nullable=False)
    lastname = Column(String, nullable=False)
    dateofbirth = Column(Date, nullable=False)

class Post(Base):
    __tablename__ = 'post'
    id = Column(BigInteger, primary_key=True, nullable=False)
    title = Column(String, nullable=False)
    category = Column(String, nullable=False)
    published_on = Column(Date, nullable=False)
    content = Column(String, nullable=False)
    view_count = Column(BigInteger, nullable=False, default=0)

@app.route("/")
def home():
    return "Hello there. Please hit a correct URL."

@app.route('/register', methods=['POST'])
@cross_origin()
def register():
    try:
        data = request.json
        # Create an instance of the model with the provided data
        new_data = User(email=data['email'], password=data['password'],
                             firstname=data['firstName'], lastname=data['lastName'], dateofbirth=data['dob'])
    

        # Add the new data to the session
        session.add(new_data)

        # Commit the changes to the database
        session.commit()

        print("Data inserted successfully!")
        return jsonify(data)

    except (exc.SQLAlchemyError, Exception) as error:
        print("Error while connecting to PostgreSQL:", error)
        return jsonify({'data': 'Error Occurred!'})

    # finally:
    #     session.close()

@app.route('/login', methods=['POST'])
@cross_origin()
def login():
    email = request.json.get('email')
    password = request.json.get('password')
    print(email)
    if not email or not password:
        return jsonify({'message': 'Please provide both email and password'}), 400

    session = Session()

    user = session.query(User).filter_by(email=email).first()
    if not user or not user.password == password:
        return jsonify({'message': 'Invalid email or password'}), 401

    # You can customize the session management to include more information
    # about the user if needed.
    # session['user_id'] = user.userid
    # session['email'] = user.email

    session.close()

    return jsonify({'message': 'Login successful'}), 200

@app.route('/email-check', methods=['POST'])
@cross_origin()
def forgotPasswordEmailCheck():
    email = request.json.get('email')
    print(email)

    if not email:
        return jsonify({'message': 'Please provide email'}), 400

    session = Session()

    user = session.query(User).filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'This email is not registred'}), 401

    # You can customize the session management to include more information
    # about the user if needed.
    # session['user_id'] = user.userid
    # session['email'] = user.email

    session.close()

    return jsonify({'message': 'Successful'}), 200

@app.route('/forgot-password', methods=['POST'])
@cross_origin()
def forgotPassword():
    email = request.json.get('email')
    password = request.json.get('confirmPassword')
    print(password)

    if not email:
        return jsonify({'message': 'Please provide email'}), 400

    session = Session()

    user = session.query(User).filter_by(email=email).first()
    if not user:
        return jsonify({'message': 'This email is not registred'}), 401

    # You can customize the session management to include more information
    # about the user if needed.
    # session['user_id'] = user.userid
    # session['email'] = user.email

    user.password = password

    session.commit()
    session.close()

    return jsonify({'message': 'Password updated successfully'}), 200

@app.route('/content-list', methods=['GET'])
@cross_origin()
def getContentList():
    session = Session()

    data = session.query(Post).all()
    data_list = [{"id": obj.id, "title": obj.title, 'category': obj.category, 'date': obj.published_on, 'content': obj.content, 'view_count': obj.view_count} for obj in data]
    
    session.commit()
    session.close()

    return jsonify(data_list), 200

@app.route('/view-count', methods=['POST'])
@cross_origin()
def increaseViewCount():
    try:
        data = request.json
        session = Session()

        row = session.query(Post).filter_by(id=data['id']).first()

        if row:
            row.view_count += 1

        session.commit()

        return jsonify(data)

    except (exc.SQLAlchemyError, Exception) as error:
        print("Error while connecting to PostgreSQL:", error)
        return jsonify({'data': 'Error Occurred!'})


def main():
    app.run(debug=True)
    

if __name__ == '__main__':
    main()