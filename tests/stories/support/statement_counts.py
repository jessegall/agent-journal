def reads_in_last_request(story, fragment: str) -> int:
    """How many read statements that contain the fragment the story's last request ran."""
    return sum(count for sql, count in story.repeated_work.read_texts.items() if fragment in sql)
