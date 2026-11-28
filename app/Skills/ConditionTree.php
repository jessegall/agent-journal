<?php

declare(strict_types=1);

namespace App\Skills;

use App\Access\Contracts\PolicyCatalogue;
use App\Access\Values\PolicyDefinition;
use App\Agents\Enums\AccessType;
use App\Agents\Values\ProviderKey;
use App\Attributes\Rules\DecodesAnyJson;
use App\Reads\ReadOnlyStretch;
use App\Skills\Conditions\AllOf;
use App\Skills\Conditions\AnyOf;
use App\Skills\Conditions\Drivers;
use App\Skills\Conditions\Environments;
use App\Skills\Conditions\Everyone;
use App\Skills\Conditions\Grants;
use App\Skills\Conditions\Named;
use App\Skills\Conditions\Not;
use App\Skills\Conditions\ProfileBases;
use App\Skills\Conditions\Profiles;
use App\Skills\Conditions\Providers;
use App\Skills\Conditions\RegisteredCondition;
use App\Skills\Contracts\SkillCondition;
use App\Skills\Exceptions\SkillConditionInvalid;
use App\Skills\Values\AccessRequirement;
use App\Skills\Values\ConditionNode;
use App\Text\StableKey;
use App\Values\DriverKey;
use App\Values\ProfileBase;
use App\Values\ProfileKey;
use Closure;
use Illuminate\Contracts\Container\Container;
use Illuminate\Contracts\Debug\ExceptionHandler;
use Illuminate\Validation\ValidationException;
use InvalidArgumentException;
use JsonException;
use Spatie\LaravelData\Exceptions\CannotCreateData;
use ValueError;

/**
 * Reads a condition from the JSON wire format into typed conditions, and checks a condition built in PHP by reading
 * what it writes, so both pass one validator. Limits are checked first, then every field; anything unknown or out of
 * shape refuses the whole tree before it is evaluated. A named condition is bound to its registered evaluator.
 */
final readonly class ConditionTree
{
    public const int MOST_DEPTH = 16;

    public const int MOST_NODES = 256;

    public const int MOST_PARAMETER_BYTES = 32_768;

    private const string NAMED_KEY = '/^[a-z0-9]+(-[a-z0-9]+)*\.[a-z0-9]+(-[a-z0-9]+)*$/D';

    public function __construct(
        private ConditionRegistry $registry,
        private Container $container,
        private ReadOnlyStretch $stretch,
        private ExceptionHandler $failures,
        private PolicyCatalogue $policies,
    ) {}

    /**
     * The condition its wire JSON names. The tree is checked node by node against its depth, size and parameter limits
     * before any node is read, and each condition's parameters are that registered condition's own, so no Data class
     * holds it.
     *
     * @throws SkillConditionInvalid
     */
    #[DecodesAnyJson]
    public function fromJson(string $json): SkillCondition
    {
        try {
            $wire = json_decode($json, true, self::MOST_DEPTH * 2 + 4, JSON_THROW_ON_ERROR);
        } catch (JsonException $failure) {
            throw SkillConditionInvalid::notJson($failure);
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
        $pending = [[
            $wire,
            1,
        ]];

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
                $pending[] = [
                    $child,
                    $level + 1,
                ];
            }
        }
    }

    /**
     * @throws SkillConditionInvalid
     */
    private function node(mixed $wire, string $path): SkillCondition
    {
        $node = ConditionNode::read($wire, $path);

        return match ($node->type) {
            Everyone::TYPE => $this->leaf($node, Everyone::VERSION, fn () => new Everyone()),
            Grants::TYPE => $this->keyed($node, Grants::VERSION, fn (array $keys) => new Grants(
                array_map(fn (string $key) => $this->requirementOf($key, $node), $keys),
            )),
            Profiles::TYPE => $this->keyed($node, Profiles::VERSION, fn (array $keys) => new Profiles(
                array_map(ProfileKey::from(...), $keys),
            )),
            ProfileBases::TYPE => $this->keyed($node, ProfileBases::VERSION, fn (array $keys) => new ProfileBases(
                array_map(ProfileBase::of(...), $keys),
            )),
            Drivers::TYPE => $this->keyed($node, Drivers::VERSION, fn (array $keys) => new Drivers(
                array_map(DriverKey::from(...), $keys),
            )),
            Providers::TYPE => $this->keyed($node, Providers::VERSION, fn (array $keys) => new Providers(
                array_map(ProviderKey::from(...), $keys),
            )),
            Environments::TYPE => $this->keyed($node, Environments::VERSION, fn (array $keys) => new Environments(
                $this->environmentKeys($keys, $node->path),
            )),
            Named::TYPE => $this->named($node),
            AllOf::TYPE => new AllOf($this->children($node, AllOf::VERSION, 'needs at least one condition')),
            AnyOf::TYPE => new AnyOf($this->children($node, AnyOf::VERSION, 'needs at least one condition')),
            Not::TYPE => new Not($this->onlyChild($node)),
            default => throw SkillConditionInvalid::field($node->at('type'), "names the unknown type {$node->type}"),
        };
    }

    /**
     * @param  Closure(): SkillCondition  $make
     *
     * @throws SkillConditionInvalid
     */
    private function leaf(ConditionNode $node, int $version, Closure $make): SkillCondition
    {
        $node->requireShape($version, []);

        return $make();
    }

    /**
     * The requirement a stored key names, a policy and an access read from the policies available now; a pair no
     * available policy accepts is refused when the condition is read, before any skill is delivered.
     *
     * @throws SkillConditionInvalid
     */
    private function requirementOf(string $key, ConditionNode $node): AccessRequirement
    {
        [$policy, $access] = str_contains($key, ':') ? explode(':', $key, 2) : [
            $key,
            '',
        ];

        $accessType = AccessType::tryFrom($access);

        $definition = array_find(
            $this->policies->grantable(),
            fn (PolicyDefinition $definition) => $definition->policy === $policy
                && $accessType !== null
                && $definition->supports($accessType),
        );

        if ($definition === null || $accessType === null) {
            throw SkillConditionInvalid::field($node->at('keys'), "names no grant an available policy accepts: {$key}");
        }

        return new AccessRequirement($definition->policy, $accessType);
    }

    /**
     * @param  Closure(list<string>): SkillCondition  $make
     *
     * @throws SkillConditionInvalid
     */
    private function keyed(ConditionNode $node, int $version, Closure $make): SkillCondition
    {
        $node->requireShape($version, ['keys']);
        $keys = $node->field('keys', 'needs at least one key');

        if (! is_array($keys) || ! array_is_list($keys) || $keys === []) {
            throw SkillConditionInvalid::field($node->at('keys'), 'needs at least one key');
        }

        foreach ($keys as $index => $key) {
            if (! is_string($key)) {
                throw SkillConditionInvalid::field($node->at("keys[{$index}]"), 'is not text');
            }
        }

        if (count(array_unique($keys)) !== count($keys)) {
            throw SkillConditionInvalid::field($node->at('keys'), 'names a key twice');
        }

        try {
            return $make($keys);
        } catch (InvalidArgumentException|ValueError $refusal) {
            $problem = 'holds a key that is not valid: '.$refusal->getMessage();

            throw SkillConditionInvalid::field($node->at('keys'), $problem, previous: $refusal);
        }
    }

    /**
     * A named condition: bound to its evaluator when its owner is installed, else kept as written and unavailable.
     *
     * @throws SkillConditionInvalid
     */
    private function named(ConditionNode $node): SkillCondition
    {
        $node->requireShape($node->version, ['key', 'parameters']);

        $key = $node->field('key', 'is not an owner-prefixed key such as plans.active-plan');
        $parameters = $node->hasField('parameters') ? $node->field('parameters', 'is not an object') : [];

        if (! is_string($key) || preg_match(self::NAMED_KEY, $key) !== 1) {
            $problem = 'is not an owner-prefixed key such as plans.active-plan';

            throw SkillConditionInvalid::field($node->at('key'), $problem);
        }

        if ($node->version < 1) {
            throw SkillConditionInvalid::field($node->at('version'), 'is below 1');
        }

        if (! is_array($parameters) || array_is_list($parameters) && $parameters !== []) {
            throw SkillConditionInvalid::field($node->at('parameters'), 'is not an object');
        }

        if (! $this->registry->has($key)) {
            return new Named($key, $node->version, $parameters);
        }

        $definition = $this->registry->definition($key);

        if ($node->version !== $definition->version) {
            $problem = "is {$node->version}, but {$key} is at version {$definition->version}";

            throw SkillConditionInvalid::field($node->at('version'), $problem);
        }

        try {
            $conditionParameters = $definition->parameters::validateAndCreate($parameters);
        } catch (ValidationException|CannotCreateData $refusal) {
            $problem = 'does not fit '.$key.': '.$refusal->getMessage();

            throw SkillConditionInvalid::field($node->at('parameters'), $problem, previous: $refusal);
        }

        return new RegisteredCondition(
            $key,
            $definition->version,
            $parameters,
            $conditionParameters,
            $this->container->make($definition->evaluator),
            $this->stretch,
            $this->failures,
        );
    }

    /**
     * @return list<SkillCondition>
     *
     * @throws SkillConditionInvalid
     */
    private function children(ConditionNode $node, int $version, string $emptyProblem): array
    {
        $node->requireShape($version, ['children']);
        $children = $node->field('children', $emptyProblem);

        if (! is_array($children) || ! array_is_list($children) || $children === []) {
            throw SkillConditionInvalid::field($node->at('children'), $emptyProblem);
        }

        return array_map(
            fn (mixed $child, int $index) => $this->node($child, $node->at("children[{$index}]")),
            $children,
            array_keys($children),
        );
    }

    /**
     * @throws SkillConditionInvalid
     */
    private function onlyChild(ConditionNode $node): SkillCondition
    {
        $children = $this->children($node, Not::VERSION, 'needs exactly one condition');

        if (count($children) !== 1) {
            throw SkillConditionInvalid::field($node->at('children'), 'needs exactly one condition');
        }

        return $children[0];
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
