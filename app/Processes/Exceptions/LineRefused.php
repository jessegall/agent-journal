<?php

declare(strict_types=1);

namespace App\Processes\Exceptions;

use App\Bus\Contracts\CodedRefusal;
use App\Bus\Enums\RefusalCode;
use App\Bus\Exceptions\Concerns\RendersRefusal;
use App\Processes\Calls\AdmissionRefusalDetails;
use App\Processes\Values\AdmissionRefusal;
use RuntimeException;

/**
 * The shell admission refused the line: nothing started, and the details say why, where and what to do instead.
 */
final class LineRefused extends RuntimeException implements CodedRefusal
{
    use RendersRefusal;

    private function __construct(string $message, private readonly AdmissionRefusal $refusal)
    {
        parent::__construct($message);
    }

    public static function for(AdmissionRefusal $refusal): self
    {
        return new self($refusal->message(), $refusal);
    }

    public function refusalCode(): RefusalCode
    {
        return RefusalCode::AdmissionRefused;
    }

    protected function status(): int
    {
        return 422;
    }

    /**
     * @return array<string, mixed>
     */
    protected function details(): array
    {
        return AdmissionRefusalDetails::of($this->refusal)->toArray();
    }
}
