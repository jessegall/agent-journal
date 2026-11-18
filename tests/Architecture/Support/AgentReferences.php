<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Agents\Support\AgentContext;
use App\Agents\Support\StackTarget;
use ReflectionClass;
use ReflectionMethod;
use ReflectionNamedType;
use ReflectionType;
use ReflectionUnionType;

/**
 * Finds where a domain stores or names an agent instead of an actor: a column for an agent or an agent session in its
 * migrations, and a model method that takes or returns a stack target or an agent context.
 */
final readonly class AgentReferences
{
    /**
     * A column naming an agent or an agent session: agent_id, session_id, or either with a prefix.
     */
    private const string AGENT_COLUMN = '/^(?:[a-z_]+_)?(?:agent|session)_id$/';

    /**
     * The Core types that stand for one agent's stack or request; a domain model names an actor instead.
     */
    private const array AGENT_TYPES = [StackTarget::class, AgentContext::class];

    /**
     * Every agent or session column the migrations in the folder create, as table.column.
     *
     * @return list<string>
     */
    public static function columnsIn(string $migrationsFolder): array
    {
        $found = [];

        foreach (glob($migrationsFolder.'/*.php') ?: [] as $migration) {
            $text = (string) file_get_contents($migration);
            preg_match_all("/Schema::(?:create|table)\\('([a-z_]+)'(.*?)\\n        \\}\\);/s", $text, $tables, PREG_SET_ORDER);

            foreach ($tables as [, $table, $body]) {
                preg_match_all("/\\\$table->\\w+\\('([a-z_]+)'/", $body, $columns);

                foreach (array_unique($columns[1]) as $column) {
                    if (preg_match(self::AGENT_COLUMN, $column) === 1) {
                        $found[] = "{$table}.{$column}";
                    }
                }
            }
        }

        return $found;
    }

    /**
     * Every method of the model classes in the folder that takes or returns a stack target or an agent context, as
     * Class::method().
     *
     * @return list<string>
     */
    public static function modelMethodsIn(string $modelsFolder): array
    {
        $found = [];

        foreach (glob($modelsFolder.'/*.php') ?: [] as $file) {
            $class = self::classIn($file);

            foreach (new ReflectionClass($class)->getMethods() as $method) {
                if ($method->getDeclaringClass()->getName() === $class && self::namesAnAgent($method)) {
                    $found[] = new ReflectionClass($class)->getShortName()."::{$method->getName()}()";
                }
            }
        }

        return $found;
    }

    private static function namesAnAgent(ReflectionMethod $method): bool
    {
        $types = [$method->getReturnType(), ...array_map(fn ($parameter) => $parameter->getType(), $method->getParameters())];

        return array_filter($types, fn (ReflectionType|null $type) => array_intersect(self::typeNames($type), self::AGENT_TYPES) !== []) !== [];
    }

    /**
     * @return list<string>
     */
    private static function typeNames(ReflectionType|null $type): array
    {
        return match (true) {
            $type instanceof ReflectionNamedType => [$type->getName()],
            $type instanceof ReflectionUnionType => array_values(array_map(fn (ReflectionType $part) => $part instanceof ReflectionNamedType ? $part->getName() : '', $type->getTypes())),
            default => [],
        };
    }

    /**
     * @return class-string
     */
    private static function classIn(string $file): string
    {
        $text = (string) file_get_contents($file);
        $namespace = preg_match('/^namespace ([^;]+);/m', $text, $namespaceMatch) === 1 ? $namespaceMatch[1] : throw new \LogicException("{$file} declares no namespace.");
        $class = preg_match('/^(?:final |abstract )*class (\w+)/m', $text, $classMatch) === 1 ? $classMatch[1] : throw new \LogicException("{$file} declares no class.");

        /** @var class-string */
        return $namespace.'\\'.$class;
    }
}
