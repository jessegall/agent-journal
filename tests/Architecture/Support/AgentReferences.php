<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Agents\Support\AgentContext;
use App\Agents\Values\StackTarget;
use App\Reflection\Enums\TypeShape;
use App\Reflection\Support\DeclaredType;
use App\Reflection\Support\ReflectedMethod;
use App\Reflection\Support\ReflectedParameter;
use App\Reflection\Support\Reflector;
use PhpOption\Option;
use Tests\Architecture\Support\Exceptions\FileDeclaresNoClass;

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
            preg_match_all(
                "/Schema::(?:create|table)\\('([a-z_]+)'(.*?)\\n        \\}\\);/s",
                $text,
                $tables,
                PREG_SET_ORDER,
            );

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

            $model = Reflector::of($class);

            foreach ($model->methods() as $method) {
                if ($method->declaringClass()->name() === $class && self::namesAnAgent($method)) {
                    $found[] = $model->shortName()."::{$method->name()}()";
                }
            }
        }

        return $found;
    }

    private static function namesAnAgent(ReflectedMethod $method): bool
    {
        $types = [
            $method->returnType(),
            ...array_map(fn (ReflectedParameter $parameter) => $parameter->type(), $method->parameters()),
        ];

        return array_filter(
            $types,
            fn (Option $type) => array_intersect(self::typeNames($type), self::AGENT_TYPES) !== [],
        ) !== [];
    }

    /**
     * @param  Option<DeclaredType>  $declared
     * @return list<string>
     */
    private static function typeNames(Option $declared): array
    {
        if ($declared->isEmpty()) {
            return [];
        }

        $type = $declared->get();

        return match ($type->shape) {
            TypeShape::Named => [$type->name()],
            TypeShape::Union => array_map(
                fn (DeclaredType $part) => $part->isNamed() ? $part->name() : '',
                $type->members,
            ),
            TypeShape::Intersection => [],
        };
    }

    /**
     * @return class-string
     */
    private static function classIn(string $file): string
    {
        $text = (string) file_get_contents($file);

        if (preg_match('/^namespace ([^;]+);/m', $text, $namespaceMatch) !== 1) {
            throw FileDeclaresNoClass::withoutNamespace($file);
        }

        if (preg_match('/^(?:final |abstract )*class (\w+)/m', $text, $classMatch) !== 1) {
            throw FileDeclaresNoClass::withoutClass($file);
        }

        /**
         * @var class-string
         */
        return $namespaceMatch[1].'\\'.$classMatch[1];
    }
}
