<?php

declare(strict_types=1);

namespace App\Agents\Resolvers;

use App\Agents\Contracts\HostCapabilities;
use App\Agents\Enums\AccountModeType;
use App\Agents\Enums\CapabilityStatusType;
use App\Agents\Enums\ExecutionModeType;
use App\Agents\Enums\HostCapabilityType;
use App\Agents\Exceptions\CapabilityMatrixInvalid;
use App\Agents\Support\HostCapability;
use App\Agents\Support\HostCapabilityQuery;
use App\Programs\Enums\HookProgram;
use BackedEnum;
use JsonException;

/**
 * Answers from the checked-in matrix docs/accounts/container-capabilities.json; a capability without a row is
 * unverified, so nothing that needs it launches.
 */
final readonly class RecordedHostCapabilities implements HostCapabilities
{
    private const string UNRECORDED_EVIDENCE = 'docs/accounts/launch-handshake.md';

    public function __construct(private string $matrixPath) {}

    /**
     * @throws CapabilityMatrixInvalid
     */
    public function capability(HostCapabilityQuery $query): HostCapability
    {
        foreach ($this->rows() as $capability) {
            if ($capability->query == $query) {
                return $capability;
            }
        }

        return new HostCapability(
            $query,
            CapabilityStatusType::Unverified,
            self::UNRECORDED_EVIDENCE,
            'No evidence is recorded for this combination.',
        );
    }

    /**
     * @return list<HostCapability>
     *
     * @throws CapabilityMatrixInvalid
     */
    private function rows(): array
    {
        try {
            $matrix = json_decode((string) file_get_contents($this->matrixPath), true, 8, JSON_THROW_ON_ERROR);
        } catch (JsonException $failure) {
            throw CapabilityMatrixInvalid::unreadable($this->matrixPath, $failure);
        }

        if (! isset($matrix['rows']) || ! is_array($matrix['rows'])) {
            throw CapabilityMatrixInvalid::withoutRows($this->matrixPath);
        }

        $rows = [];

        foreach ($matrix['rows'] as $number => $row) {
            $rows[] = new HostCapability(
                new HostCapabilityQuery(
                    $this->caseField($row, $number, 'capability', HostCapabilityType::class),
                    $this->caseField($row, $number, 'program', HookProgram::class),
                    $this->caseField($row, $number, 'account_mode', AccountModeType::class),
                    $this->caseField($row, $number, 'execution_mode', ExecutionModeType::class),
                ),
                $this->caseField($row, $number, 'status', CapabilityStatusType::class),
                $this->field($row, $number, 'evidence'),
                $this->field($row, $number, 'reason'),
            );
        }

        return $rows;
    }

    /**
     * @param  array<string, mixed>  $row
     *
     * @throws CapabilityMatrixInvalid
     */
    private function field(array $row, int $number, string $name): string
    {
        if (! isset($row[$name]) || ! is_string($row[$name]) || $row[$name] === '') {
            throw CapabilityMatrixInvalid::row($this->matrixPath, $number, $name);
        }

        return $row[$name];
    }

    /**
     * The field as a case of its enum.
     *
     * @template TEnum of BackedEnum
     *
     * @param  array<string, mixed>  $row
     * @param  class-string<TEnum>  $enum
     * @return TEnum
     *
     * @throws CapabilityMatrixInvalid
     */
    private function caseField(array $row, int $number, string $name, string $enum): BackedEnum
    {
        return $enum::tryFrom($this->field($row, $number, $name))
            ?? throw CapabilityMatrixInvalid::row($this->matrixPath, $number, $name);
    }
}
