<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Support\Reflector;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Query\Builder as QueryBuilder;
use Tests\Support\ScanCache\ScanCache;

/**
 * The writes of every Eloquent model of the given folders outside its own row, found by ModelWriteScan in the
 * models, their traits and private helpers, with each call of another model's writing method resolved against
 * that model; and the frozen lists of the methods still waiting to move their writes into their models, one file per area.
 *
 * @phpstan-import-type Type from ModelWriteScan
 * @phpstan-import-type Method from ModelWriteScan
 */
final readonly class ModelWrites
{
    public const string FROZEN_LISTS = 'tests/Architecture/FrozenModelWrites';

    /**
     * @param  list<ModelWrite>  $writes
     */
    private function __construct(private string $projectRoot, private array $writes) {}

    /**
     * The models of app and every domain: every class under a Models folder that is an Eloquent model.
     */
    public static function across(string $projectRoot): self
    {
        $folders = [
            "{$projectRoot}/app/Models",
            ...glob("{$projectRoot}/domain/*/src/Models", GLOB_ONLYDIR) ?: [],
        ];

        return self::in($projectRoot, $folders);
    }

    /**
     * @param  list<string>  $folders
     */
    public static function in(string $projectRoot, array $folders): self
    {
        $types = self::typesIn(DomainFiles::in($folders));
        $models = array_filter($types, self::isModel(...));
        $types = self::withTraitsOf($models, $types);
        $writers = self::writersOf($models, $types);
        $writes = [];

        foreach (self::usedTypes($models, $types) as $path => $type) {
            $relative = substr($path, strlen($projectRoot) + 1);

            if ($type['touchesOwnersAt'] !== null) {
                $writes[] = new ModelWrite(
                    $relative,
                    $type['touchesOwnersAt'],
                    $type['name'],
                    '$touches',
                    'saves its owners',
                    '$touches',
                );
            }

            foreach ($type['methods'] as $method) {
                foreach (self::writesOf($method, $type, $writers) as [$line, $form, $evidence]) {
                    $writes[] = new ModelWrite(
                        $relative,
                        $line,
                        $type['name'],
                        $method['name'],
                        $form,
                        $evidence,
                    );
                }
            }
        }

        usort($writes, fn (ModelWrite $first, ModelWrite $second) => $first->place() <=> $second->place());

        return new self($projectRoot, $writes);
    }

    /**
     * @return list<ModelWrite>
     */
    public function writes(): array
    {
        return $this->writes;
    }

    /**
     * Each method found writing outside its own row, by area, sorted.
     *
     * @return array<string, list<string>>
     */
    public function methods(): array
    {
        $methods = [];

        foreach ($this->writes as $write) {
            $methods[$write->area()][] = $write->key();
        }

        return self::sorted($methods);
    }

    /**
     * Each method the frozen lists hold, by area, sorted.
     *
     * @return array<string, list<string>>
     */
    public function frozenMethods(): array
    {
        $methods = [];

        foreach (glob("{$this->projectRoot}/".self::FROZEN_LISTS.'/*.php') ?: [] as $list) {
            /** @var array<string, int> $phases */
            $phases = require $list;
            $methods[basename($list, '.php')] = array_keys($phases);
        }

        return self::sorted($methods);
    }

    /**
     * What differs from the frozen lists: each new write with its place and call, and each listed method that no
     * longer writes outside its own row.
     */
    public function report(): string
    {
        $frozen = $this->frozenMethods();
        $found = $this->methods();
        $lines = [];

        foreach ($this->writes as $write) {
            if (! in_array($write->key(), $frozen[$write->area()] ?? [], true)) {
                $lines[] = "  new: {$write->line()}; write only this row, and raise a fact for the rest";
            }
        }

        foreach ($frozen as $area => $methods) {
            foreach (array_diff($methods, $found[$area] ?? []) as $gone) {
                $list = self::FROZEN_LISTS."/{$area}.php";
                $lines[] = "  gone: {$list} lists {$gone}, which writes only its own row now; remove its line";
            }
        }

        return implode("\n", $lines);
    }

    /**
     * @param  array<string, list<string>>  $methods
     * @return array<string, list<string>>
     */
    private static function sorted(array $methods): array
    {
        $sorted = [];

        foreach ($methods as $area => $keys) {
            $keys = array_values(array_unique($keys));
            sort($keys);
            $sorted[$area] = $keys;
        }

        ksort($sorted);

        return $sorted;
    }

    /**
     * @param  Type  $type
     */
    private static function isModel(array $type): bool
    {
        return ! $type['isTrait']
            && Reflector::exists($type['type'])
            && Reflector::of($type['type'])->isSubclassOf(Model::class);
    }

    /**
     * @param  list<string>  $paths
     * @return array<string, Type> by path
     */
    private static function typesIn(array $paths): array
    {
        $types = [];

        foreach (ScanCache::findingsByFile(new ModelWriteScan(), $paths) as $path => $found) {
            foreach ($found as $type) {
                $types[$path.'#'.$type['type']] = $type;
            }
        }

        return $types;
    }

    /**
     * The types with every trait the models use added, wherever the trait lives.
     *
     * @param  array<string, Type>  $models
     * @param  array<string, Type>  $types
     * @return array<string, Type>
     */
    private static function withTraitsOf(array $models, array $types): array
    {
        $known = array_column($types, 'type');
        $missing = [];

        foreach ($models as $model) {
            foreach ($model['traits'] as $trait) {
                $file = Reflector::exists($trait) && Reflector::of($trait)->isTrait()
                    ? Reflector::of($trait)->fileName()->getOrElse('')
                    : '';
                $isProjectCode = preg_match('#/(app|domain|tests)/#', $file) === 1 && ! str_contains($file, '/vendor/');

                if (! in_array($trait, $known, true) && $isProjectCode) {
                    $missing[] = $file;
                }
            }
        }

        return $missing === [] ? $types : [...$types, ...self::typesIn(array_values(array_unique($missing)))];
    }

    /**
     * The models and the traits they use, by path.
     *
     * @param  array<string, Type>  $models
     * @param  array<string, Type>  $types
     * @return array<string, Type>
     */
    private static function usedTypes(array $models, array $types): array
    {
        $traits = array_merge([], ...array_column($models, 'traits'));
        $used = [];

        foreach ($types as $key => $type) {
            if (! $type['isTrait'] && ! isset($models[$key])) {
                continue;
            }

            $isCaptureSafe = in_array(
                $type['type'],
                [ModelWriteScan::RAISES_EVENTS, ModelWriteScan::INSERTS_ABSENT_ROWS],
                true,
            );

            if ($type['isTrait'] && (! in_array($type['type'], $traits, true) || $isCaptureSafe)) {
                continue;
            }

            $used[explode('#', $key)[0]] = $type;
        }

        return $used;
    }

    /**
     * The names of the methods that write, by model class: its own and its traits' methods that write a row, its own
     * or another, directly or through another of its methods.
     *
     * @param  array<string, Type>  $models
     * @param  array<string, Type>  $types
     * @return array<string, list<string>>
     */
    private static function writersOf(array $models, array $types): array
    {
        $byType = array_column($types, null, 'type');
        $methods = [];

        foreach ($models as $model) {
            $traitMethods = array_merge(
                [],
                ...array_map(fn (string $trait) => $byType[$trait]['methods'] ?? [], $model['traits']),
            );
            $methods[$model['type']] = [...$model['methods'], ...$traitMethods];
        }

        $writers = array_map(fn () => [], $methods);

        do {
            $grown = false;

            foreach ($methods as $class => $classMethods) {
                foreach ($classMethods as $method) {
                    $isKnown = in_array($method['name'], $writers[$class], true);

                    if ($isKnown || ! self::isWriter($method, $class, $writers)) {
                        continue;
                    }

                    $writers[$class][] = $method['name'];
                    $grown = true;
                }
            }
        } while ($grown);

        return $writers;
    }

    /**
     * @param  Method  $method
     * @param  array<string, list<string>>  $writers
     */
    private static function isWriter(array $method, string $class, array $writers): bool
    {
        return $method['writesOwnRow']
            || $method['writes'] !== []
            || array_intersect($method['ownCalls'], $writers[$class]) !== []
            || self::callWrites($method, $class, $writers) !== [];
    }

    /**
     * @param  Method  $method
     * @param  Type  $type
     * @param  array<string, list<string>>  $writers
     * @return list<array{int, string, string}>
     */
    private static function writesOf(array $method, array $type, array $writers): array
    {
        return [
            ...array_map(fn (array $write) => [$write['line'], $write['form'], $write['evidence']], $method['writes']),
            ...self::callWrites($method, $type['type'], $writers),
        ];
    }

    /**
     * Each call of the method on another receiver that runs a writing method of a model.
     *
     * @param  Method  $method
     * @param  array<string, list<string>>  $writers
     * @return list<array{int, string, string}>
     */
    private static function callWrites(array $method, string $class, array $writers): array
    {
        $writes = [];

        foreach ($method['calls'] as $call) {
            $form = self::callForm($call['class'], $call['method'], $class, $writers);

            if ($form !== null) {
                $writes[] = [$call['line'], $form, $call['evidence']];
            }
        }

        return $writes;
    }

    /**
     * @param  array<string, list<string>>  $writers
     */
    private static function callForm(string|null $receiver, string $method, string $class, array $writers): string|null
    {
        if ($receiver !== null) {
            $short = ModelWriteScan::shortName($receiver);

            return match (true) {
                isset($writers[$receiver]) && ModelWriteScan::isWrite($method) => "writes a row of {$short}",
                ! in_array($method, $writers[$receiver] ?? [], true) => null,
                $receiver === $class => "writes another row of its class through {$method}",
                default => "calls {$short}::{$method}, which writes",
            };
        }

        // A call on an unknown object that a query builder answers without writing, such as select, is a read.
        if (! ModelWriteScan::isWrite($method) && Reflector::of(QueryBuilder::class)->hasMethod($method)) {
            return null;
        }

        $owners = array_keys(array_filter($writers, fn (array $names) => in_array($method, $names, true)));
        $shortOwners = array_map(ModelWriteScan::shortName(...), $owners);

        $ownerNames = implode(', ', $shortOwners);

        return $owners === [] ? null : "calls {$method}, a writing method of {$ownerNames}, on another object";
    }
}
