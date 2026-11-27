<?php

declare(strict_types=1);

namespace App\Accounts;

use App\Accounts\Exceptions\DraftAnswerMissing;

/**
 * The answers to a guided draft's three questions, each trimmed; an empty or missing answer is refused, never filled
 * in.
 */
final readonly class DraftAnswers
{
    public const int QUESTION_COUNT = 3;

    /**
     * @param  list<string>  $answers
     *
     * @throws DraftAnswerMissing
     */
    public static function of(array $answers): self
    {
        $trimmed = array_pad(array_map(trim(...), $answers), self::QUESTION_COUNT, '');

        foreach (range(1, self::QUESTION_COUNT) as $number) {
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
