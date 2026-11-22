<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Concerns\RendersRefusal;
use App\Contracts\CodedRefusal;
use App\Contracts\CommandRefusal;
use App\Contracts\ReceiptRefusal;
use App\Contracts\RefusalDetails;
use App\Enums\RefusalCode;
use RuntimeException;
use Symfony\Component\HttpFoundation\Response;

/**
 * The refusal a write got the first time, given again to a retry with the same request key.
 */
final class RefusalReplayed extends RuntimeException implements
    CodedRefusal,
    CommandRefusal,
    ReceiptRefusal,
    RefusalDetails
{
    use RendersRefusal;

    /**
     * @param  array<string, mixed>  $storedDetails
     */
    private function __construct(
        private readonly RefusalCode $storedCode,
        string $message,
        private readonly array $storedDetails,
    ) {
        parent::__construct($message);
    }

    /**
     * @param  array<string, mixed>  $details
     */
    public static function of(RefusalCode $code, string $message, array $details): self
    {
        return new self($code, $message, $details);
    }

    public function refusalCode(): RefusalCode
    {
        return $this->storedCode;
    }

    public function refusalDetails(): array
    {
        $details = $this->storedDetails;

        if (isset($details['next_action']['arguments'])) {
            $details['next_action']['arguments'] = (object) $details['next_action']['arguments'];
        }

        return $details;
    }

    /**
     * @return array<string, mixed>
     */
    protected function details(): array
    {
        return $this->refusalDetails();
    }

    protected function status(): int
    {
        return Response::HTTP_CONFLICT;
    }
}
