class TopicLoadException(Exception):
    def __init__(self, error_code):
        message = f"Failure loading topics from database {error_code}"
        super().__init__(self.MESSAGE)

class HeadlineLoadException(Exception):
    def __init__(self, error_code):
        message = f"Failure loading headlines from database {error_code}"
        super().__init__(self.MESSAGE)

class UserLoadException(Exception):
    def __init__(self, error_code):
        message = f"Failure loading users from database {error_code}"
        super().__init__(self.MESSAGE)

class NoHeadlinesException(Exception):
    def __init__(self):
        message = f"There are no generated headlines"
        super().__init__(self.MESSAGE)