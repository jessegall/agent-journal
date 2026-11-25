<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\Bus\CommandRefusal;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;

/**
 * A guided draft was asked for without an answer to one of its questions.
 */
final class DraftAnswerMissing extends RuntimeException implements CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    public static function forQuestion(int $number): self
    {
        return new self("Question {$number} has no answer, so nothing can be drafted yet.");
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::InvalidInput;
    }

    protected function status(): int
    {
        return Response::HTTP_UNPROCESSABLE_ENTITY;
    }
}
