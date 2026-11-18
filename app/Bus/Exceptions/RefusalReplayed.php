<?php

declare(strict_types=1);

namespace App\Bus\Exceptions;

use App\Bus\Contracts\AnswersFromReceipt;
use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Contracts\CommandRefusal;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;

/**
 * The refusal a write got the first time, given again to a retry with the same request key.
 */
final class RefusalReplayed extends RuntimeException implements AnswersFromReceipt, CodedRefusal, CommandRefusal
{
    use RendersRefusal;

    private function __construct(private readonly RefusalCode $storedCode, string $message)
    {
        parent::__construct($message);
    }

    public static function of(RefusalCode $code, string $message): self
    {
        return new self($code, $message);
    }

    public function refusalCode(): RefusalCode
    {
        return $this->storedCode;
    }

    protected function status(): int
    {
        return Response::HTTP_CONFLICT;
    }
}
