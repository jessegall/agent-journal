<?php

declare(strict_types=1);

namespace App\Profiles\Support;

use App\Agents\Enums\ExecutionModeType;
use App\Agents\Values\ResourceRequest;
use App\Agents\Values\StopCondition;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Profiles\Enums\ProfileType;
use App\Profiles\Exceptions\ProfileProposalRefused;
use App\Profiles\Values\ProfileKey;
use App\Programs\Enums\HookProgram;
use TypeError;
use ValueError;

/**
 * The validated, typed form of a proposed profile configuration such as config/profiles.php: its revision, the
 * project's overrides per type, and each profile. A proposal is not live authority until an owner activates it. No
 * untyped value passes beyond this class.
 */
final readonly class ProfileProposal
{
    /**
     * Feature fields of later work; a proposal naming one is refused as unsupported.
     */
    private const array UNSUPPORTED_FIELDS = ['supervisor', 'instances', 'script', 'commands'];

    /**
     * @param  list<TypeOverride>  $typeOverrides
     * @param  list<ProposedProfile>  $profiles
     */
    public function __construct(
        public int $revision,
        public array $typeOverrides,
        public array $profiles,
    ) {}

    /**
     * Reads a proposal in its serialized shape, refusing any field it does not know or support.
     *
     * @param  array<string, mixed>  $configuration
     *
     * @throws ProfileProposalRefused
     */
    public static function fromConfiguration(array $configuration): self
    {
        try {
            $overrides = [];

            foreach ($configuration['type_overrides'] ?? [] as $type => $override) {
                $overrides[] = new TypeOverride(ProfileType::from((string) $type), self::override($override));
            }

            $profiles = [];

            foreach ($configuration['profiles'] ?? [] as $key => $profile) {
                $profiles[] = self::profile((string) $key, $profile);
            }

            return new self((int) ($configuration['revision'] ?? 0), $overrides, $profiles);
        } catch (TypeError|ValueError $failure) {
            throw ProfileProposalRefused::unreadable($failure);
        }
    }

    /**
     * The proposal with the journal's built-in profiles added; a project profile of the same key is refused as
     * repeated when it is activated.
     */
    public function withBuiltIns(): self
    {
        return new self($this->revision, $this->typeOverrides, [...BuiltInProfiles::proposed(), ...$this->profiles]);
    }

    /**
     * The project's override of the type; none when the proposal gives none.
     */
    public function overrideFor(ProfileType $type): PolicyOverride
    {
        foreach ($this->typeOverrides as $override) {
            if ($override->type === $type) {
                return $override->override;
            }
        }

        return PolicyOverride::none();
    }

    /**
     * @param  array<string, mixed>  $profile
     *
     * @throws ProfileProposalRefused
     */
    private static function profile(string $key, array $profile): ProposedProfile
    {
        foreach (self::UNSUPPORTED_FIELDS as $field) {
            if (array_key_exists($field, $profile)) {
                throw ProfileProposalRefused::unsupportedField($key, $field);
            }
        }

        $program = $profile['program'] ?? null;
        $container = $profile['container'] ?? null;

        return new ProposedProfile(
            ProfileKey::from($key),
            (string) ($profile['label'] ?? $key),
            ProfileType::from((string) $profile['type']),
            (string) ($profile['instructions'] ?? ''),
            (string) $profile['model'],
            $program === null ? null : HookProgram::from((string) $program),
            (bool) ($profile['program_pinned'] ?? false),
            self::texts($profile['allowed_models'] ?? []),
            array_key_exists('skill_allowlist', $profile) ? self::texts($profile['skill_allowlist']) : null,
            self::texts($profile['required_skills'] ?? []),
            $container === null ? null : self::executionMode((string) $container),
            self::override($profile),
            array_map(self::stopCondition(...), array_values($profile['stop_conditions'] ?? [])),
        );
    }

    /**
     * @param  array<string, mixed>  $override
     */
    private static function override(array $override): PolicyOverride
    {
        return new PolicyOverride(
            array_map(ClassRule::parse(...), self::texts($override['allow_classes'] ?? [])),
            array_map(ClassRule::parse(...), self::texts($override['remove_classes'] ?? [])),
            array_map(self::operationRule(...), array_values($override['allow_operations'] ?? [])),
            self::texts($override['remove_operations'] ?? []),
            self::texts($override['deny_operations'] ?? []),
        );
    }

    /**
     * @param  array<string, mixed>  $rule
     */
    private static function operationRule(array $rule): OperationRule
    {
        return new OperationRule((string) $rule['name'], array_map(
            fn (array $resource) => new ResourceRequest(
                ResourceAreaType::from((string) $resource['area']),
                (string) $resource['target'],
            ),
            array_values($rule['resources'] ?? []),
        ));
    }

    /**
     * @param  array<string, mixed>  $condition
     */
    private static function stopCondition(array $condition): StopCondition
    {
        return new StopCondition(
            (string) $condition['key'],
            (string) ($condition['label'] ?? $condition['key']),
            (string) $condition['executable'],
            self::texts($condition['arguments'] ?? []),
            array_map(AccessType::from(...), self::texts($condition['access'] ?? ['read', 'execute'])),
            (string) ($condition['directory'] ?? 'workspace'),
            (int) ($condition['timeout_seconds'] ?? StopCondition::DEFAULT_SECONDS),
            (int) ($condition['output_bytes'] ?? StopCondition::OUTPUT_BYTES),
            (string) ($condition['guidance'] ?? ''),
        );
    }

    /**
     * Where a proposal asks a profile to run: required means a required container, host the protected host.
     *
     * @throws ValueError
     */
    private static function executionMode(string $container): ExecutionModeType
    {
        return match ($container) {
            'required' => ExecutionModeType::RequiredContainer,
            'host' => ExecutionModeType::ProtectedHost,
            default => ExecutionModeType::from($container),
        };
    }

    /**
     * @param  array<array-key, mixed>  $values
     * @return list<string>
     */
    private static function texts(array $values): array
    {
        return array_values(array_map(strval(...), $values));
    }
}
