<?php

declare(strict_types=1);

namespace App\Processes\Values;

use App\Processes\Enums\EmptyPolicy;
use App\Processes\Exceptions\VerificationContractInvalid;

/**
 * What a run with no output means: invalid, or a success the tool states by emitting nothing, shown with a fixed
 * summary such as "Type check completed; this mode emits no success text."
 */
final readonly class EmptyRunPolicy
{
    private function __construct(public EmptyPolicy $policy, public string $summary) {}

    /**
     * @return array{policy: string, summary: string}
     */
    public function toArray(): array
    {
        return ['policy' => $this->policy->value, 'summary' => $this->summary];
    }

    /**
     * @param  array{policy: string, summary: string}  $fields
     */
    public static function fromArray(array $fields): self
    {
        return new self(EmptyPolicy::from($fields['policy']), $fields['summary']);
    }

    public static function invalid(): self
    {
        return new self(EmptyPolicy::Invalid, '');
    }

    /**
     * @throws VerificationContractInvalid
     */
    public static function allowedSuccess(string $summary): self
    {
        if (trim($summary) === '') {
            throw VerificationContractInvalid::field(
                'output.empty',
                'an allowed empty success needs the summary text it shows',
            );
        }

        return new self(EmptyPolicy::AllowedSuccess, $summary);
    }
}
