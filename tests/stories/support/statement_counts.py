def reads_in_last_request(story, fragment: str) -> int:
    """How many read statements that contain the fragment the story's last request ran, the pages of a walk too."""
    return sum(count for sql, count in story.repeated_work.request_read_texts.items() if fragment in sql)
