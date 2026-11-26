<?php

declare(strict_types=1);

namespace App\Accounts;

use App\Accounts\Exceptions\DraftAnswerMissing;

/**
 * The answers to a guided draft's questions, each trimmed; an empty or missing answer is refused, never filled in.
 */
final readonly class DraftAnswers
{
    /**
     * @param  list<string>  $answers
     *
     * @throws DraftAnswerMissing
     */
    public static function of(array $answers, int $questions): self
    {
        $trimmed = array_pad(array_map(trim(...), $answers), $questions, '');

        foreach (range(1, $questions) as $number) {
            if ($trimmed[$number - 1] === '') {
                throw DraftAnswerMissing::forQuestion($number);
            }
        }

        return new self($trimmed);
    }

    /**
     * @param  list<string>  $answers
     */
    private function __construct(public array $answers) {}

    /**
     * The answer to the question of this number, counted from one.
     */
    public function to(int $number): string
    {
        return $this->answers[$number - 1];
    }

    /**
     * The answer, cut to at most this many characters.
     */
    public function cutTo(int $number, int $limit): string
    {
        return mb_substr($this->to($number), 0, $limit);
    }
}
