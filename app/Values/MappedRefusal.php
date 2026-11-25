<?php

declare(strict_types=1);

namespace App\Values;

use App\Enums\Engine\RefusalCode;

/**
 * A failure as a caller is shown it: its refusal code, its safe message and the details that help it act, such as the
 * fields that failed validation.
 */
final readonly class MappedRefusal
{
    /**
     * @param  array<string, mixed>  $details
     */
    public function __construct(public RefusalCode $code, public string $message, public array $details = []) {}

    /**
     * @return array{code: string, message: string, details: object}
     */
    public function toArray(): array
    {
        return [
            'code' => $this->code->value,
            'message' => $this->message,
            'details' => (object) $this->details,
        ];
    }
}
