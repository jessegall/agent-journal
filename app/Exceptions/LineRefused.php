<?php

declare(strict_types=1);

namespace App\Exceptions;

use App\Api\Processes\AdmissionRefusalDetails;
use App\Concerns\RendersRefusal;
use App\Contracts\Actors\AgentTexts;
use App\Contracts\Refusals\CodedRefusal;
use App\Enums\Engine\RefusalCode;
use App\Values\AdmissionRefusal;
use RuntimeException;

/**
 * The shell admission refused the line: nothing started, and the details say why, where and what to do instead.
 */
final class LineRefused extends RuntimeException implements CodedRefusal
{
    use RendersRefusal;

    private function __construct(string $message, private readonly AdmissionRefusalDetails $details)
    {
        parent::__construct($message);
    }

    public static function for(AdmissionRefusal $refusal, AgentTexts $texts): self
    {
        return new self($texts->render($refusal->message()), AdmissionRefusalDetails::of($refusal, $texts));
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
        return $this->details->toArray();
    }
}
