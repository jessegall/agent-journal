<?php

declare(strict_types=1);

namespace App\Skills\Support;

use App\Profiles\Enums\ProfileType;
use App\Profiles\Values\ProfileKey;
use App\Skills\Conditions\AgentTypes;
use App\Skills\Conditions\AllOf;
use App\Skills\Conditions\AnyOf;
use App\Skills\Conditions\Environments;
use App\Skills\Conditions\Everyone;
use App\Skills\Conditions\MainAgent;
use App\Skills\Conditions\Named;
use App\Skills\Conditions\Not;
use App\Skills\Conditions\Profiles;
use App\Skills\Conditions\Programs;
use App\Skills\Conditions\Providers;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Exceptions\SkillConditionInvalid;
use App\Skills\Values\ProgramKey;
use App\Skills\Values\ProviderKey;
use App\Text\Support\StableKey;
use Closure;
use InvalidArgumentException;
use JsonException;
use ValueError;

/**
 * Reads a condition from the JSON wire format into typed conditions, and checks a condition built in PHP by reading
 * what it writes, so both pass one validator. Limits are checked first, then every field; anything unknown or out of
 * shape refuses the whole tree before it is evaluated.
 */
final readonly class ConditionTree
{
    public const int MOST_DEPTH = 16;

    public const int MOST_NODES = 256;

    public const int MOST_PARAMETER_BYTES = 32_768;

    private const string NAMED_KEY = '/^[a-z0-9]+(-[a-z0-9]+)*\.[a-z0-9]+(-[a-z0-9]+)*$/D';

    /**
     * @throws SkillConditionInvalid
     */
    public function fromJson(string $json): SkillCondition
    {
        try {
            $wire = json_decode($json, true, self::MOST_DEPTH * 2 + 4, JSON_THROW_ON_ERROR);
        } catch (JsonException $failure) {
            throw SkillConditionInvalid::notJson($failure->getMessage());
        }

        return $this->hydrate($wire);
    }

    /**
     * @throws SkillConditionInvalid
     */
    public function hydrate(mixed $wire): SkillCondition
    {
        $this->checkLimits($wire);

        return $this->node($wire, 'condition');
    }

    /**
     * The condition as the validator reads it back from its own wire format.
     *
     * @throws SkillConditionInvalid
     */
    public function check(SkillCondition $condition): SkillCondition
    {
        return $this->hydrate($condition->toArray());
    }

    /**
     * @throws SkillConditionInvalid
     */
    private function checkLimits(mixed $wire): void
    {
        $depth = 0;
        $nodes = 0;
        $parameterBytes = 0;
        $pending = [[$wire, 1]];

        while ($pending !== []) {
            [$node, $level] = array_pop($pending);
            $depth = max($depth, $level);
            $nodes++;

            if ($depth > self::MOST_DEPTH) {
                throw SkillConditionInvalid::tooDeep(self::MOST_DEPTH);
            }

            if ($nodes > self::MOST_NODES) {
                throw SkillConditionInvalid::tooManyNodes(self::MOST_NODES);
            }

            if (is_array($node) && array_key_exists('parameters', $node)) {
                $parameterBytes += strlen((string) json_encode($node['parameters']));
            }

            if ($parameterBytes > self::MOST_PARAMETER_BYTES) {
                throw SkillConditionInvalid::parametersTooLarge(self::MOST_PARAMETER_BYTES);
            }

            foreach (is_array($node) && is_array($node['children'] ?? null) ? $node['children'] : [] as $child) {
                $pending[] = [$child, $level + 1];
            }
        }
    }

    /**
     * @throws SkillConditionInvalid
     */
    private function node(mixed $wire, string $path): SkillCondition
    {
        if (! is_array($wire) || array_is_list($wire) && $wire !== []) {
            throw SkillConditionInvalid::field($path, 'is not an object');
        }

        $type = $wire['type'] ?? null;

        if (! is_string($type)) {
            throw SkillConditionInvalid::field("{$path}.type", 'is missing or not text');
        }

        if (! is_int($wire['version'] ?? null)) {
            throw SkillConditionInvalid::field("{$path}.version", 'is missing or not a whole number');
        }

        return match ($type) {
            Everyone::TYPE => $this->leaf($wire, $path, Everyone::VERSION, fn () => new Everyone()),
            MainAgent::TYPE => $this->leaf($wire, $path, MainAgent::VERSION, fn () => new MainAgent()),
            Profiles::TYPE => $this->keyed($wire, $path, Profiles::VERSION, fn (array $keys) => new Profiles(array_map(ProfileKey::from(...), $keys))),
            AgentTypes::TYPE => $this->keyed($wire, $path, AgentTypes::VERSION, fn (array $keys) => new AgentTypes(array_map(ProfileType::from(...), $keys))),
            Programs::TYPE => $this->keyed($wire, $path, Programs::VERSION, fn (array $keys) => new Programs(array_map(ProgramKey::from(...), $keys))),
            Providers::TYPE => $this->keyed($wire, $path, Providers::VERSION, fn (array $keys) => new Providers(array_map(ProviderKey::from(...), $keys))),
            Environments::TYPE => $this->keyed($wire, $path, Environments::VERSION, fn (array $keys) => new Environments($this->environmentKeys($keys, $path))),
            Named::TYPE => $this->named($wire, $path),
            AllOf::TYPE => new AllOf($this->children($wire, $path, AllOf::VERSION, 'children', 'needs at least one condition')),
            AnyOf::TYPE => new AnyOf($this->children($wire, $path, AnyOf::VERSION, 'children', 'needs at least one condition')),
            Not::TYPE => new Not($this->onlyChild($wire, $path)),
            default => throw SkillConditionInvalid::field("{$path}.type", "names the unknown type {$type}"),
        };
    }

    /**
     * @param  array<array-key, mixed>  $wire
     * @param  Closure(): SkillCondition  $make
     */
    private function leaf(array $wire, string $path, int $version, Closure $make): SkillCondition
    {
        $this->checkFields($wire, $path, $version, []);

        return $make();
    }

    /**
     * @param  array<array-key, mixed>  $wire
     * @param  Closure(list<string>): SkillCondition  $make
     */
    private function keyed(array $wire, string $path, int $version, Closure $make): SkillCondition
    {
        $this->checkFields($wire, $path, $version, ['keys']);
        $keys = $wire['keys'] ?? null;

        if (! is_array($keys) || ! array_is_list($keys) || $keys === []) {
            throw SkillConditionInvalid::field("{$path}.keys", 'needs at least one key');
        }

        foreach ($keys as $index => $key) {
            if (! is_string($key)) {
                throw SkillConditionInvalid::field("{$path}.keys[{$index}]", 'is not text');
            }
        }

        if (count(array_unique($keys)) !== count($keys)) {
            throw SkillConditionInvalid::field("{$path}.keys", 'names a key twice');
        }

        try {
            return $make($keys);
        } catch (InvalidArgumentException|ValueError $refusal) {
            throw SkillConditionInvalid::field("{$path}.keys", 'holds a key that is not valid: '.$refusal->getMessage());
        }
    }

    /**
     * @param  array<array-key, mixed>  $wire
     */
    private function named(array $wire, string $path): Named
    {
        $this->checkFields($wire, $path, $wire['version'], ['key', 'parameters']);
        $key = $wire['key'] ?? null;
        $parameters = $wire['parameters'] ?? [];

        if (! is_string($key) || preg_match(self::NAMED_KEY, $key) !== 1) {
            throw SkillConditionInvalid::field("{$path}.key", 'is not an owner-prefixed key such as plans.active-plan');
        }

        if ($wire['version'] < 1) {
            throw SkillConditionInvalid::field("{$path}.version", 'is below 1');
        }

        if (! is_array($parameters) || array_is_list($parameters) && $parameters !== []) {
            throw SkillConditionInvalid::field("{$path}.parameters", 'is not an object');
        }

        return new Named($key, $wire['version'], $parameters);
    }

    /**
     * @param  array<array-key, mixed>  $wire
     * @return list<SkillCondition>
     */
    private function children(array $wire, string $path, int $version, string $field, string $emptyProblem): array
    {
        $this->checkFields($wire, $path, $version, [$field]);
        $children = $wire[$field] ?? null;

        if (! is_array($children) || ! array_is_list($children) || $children === []) {
            throw SkillConditionInvalid::field("{$path}.{$field}", $emptyProblem);
        }

        return array_map(fn (mixed $child, int $index) => $this->node($child, "{$path}.{$field}[{$index}]"), $children, array_keys($children));
    }

    /**
     * @param  array<array-key, mixed>  $wire
     */
    private function onlyChild(array $wire, string $path): SkillCondition
    {
        $children = $this->children($wire, $path, Not::VERSION, 'children', 'needs exactly one condition');

        if (count($children) !== 1) {
            throw SkillConditionInvalid::field("{$path}.children", 'needs exactly one condition');
        }

        return $children[0];
    }

    /**
     * Refuses a version other than the type's, and any field the type does not take.
     *
     * @param  array<array-key, mixed>  $wire
     * @param  list<string>  $fields
     */
    private function checkFields(array $wire, string $path, int $version, array $fields): void
    {
        if ($wire['version'] !== $version) {
            throw SkillConditionInvalid::field("{$path}.version", "is {$wire['version']}, which this type does not support");
        }

        foreach (array_keys($wire) as $field) {
            if (! in_array($field, ['type', 'version', ...$fields], true)) {
                throw SkillConditionInvalid::field("{$path}.{$field}", 'is not a field of this type');
            }
        }
    }

    /**
     * @param  list<string>  $keys
     * @return list<string>
     */
    private function environmentKeys(array $keys, string $path): array
    {
        foreach ($keys as $index => $key) {
            if (! StableKey::isValid($key)) {
                throw SkillConditionInvalid::field("{$path}.keys[{$index}]", 'is not a valid environment key');
            }
        }

        return $keys;
    }
}
