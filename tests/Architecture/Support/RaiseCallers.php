<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Engine\Contracts\EngineListener;
use Illuminate\Database\Eloquent\Model;
use ReflectionClass;
use Tests\Support\ScanCache\ScanCache;

/**
 * The callers of the model transitions that raise facts: a call stands inside a unit when its file is reached from a
 * registered command's handler, is a listener marked to run in the command's transaction, or is a model; any other
 * caller (a public listener, a job, a console command, a controller, an engine tick listener, or code no command
 * reaches) raises a fact nobody collects.
 *
 * @phpstan-import-type TransitionCall from TransitionCallScan
 */
final readonly class RaiseCallers
{
    public const string MIGRATED_LISTS = 'tests/Architecture/Legacy/RaiseCallers';

    /**
     * @param  list<string>  $transitions  each migrated transition as Class::method
     * @param  array<string, list<string>>  $reach  the handlers that reach each file, by path from the root
     */
    public function __construct(
        private string $projectRoot,
        private array $transitions,
        private array $reach,
        private string $requiredListenerAttribute,
    ) {}

    /**
     * The migrated transitions every area's list holds.
     *
     * @return list<string>
     */
    public static function migrated(string $projectRoot): array
    {
        $transitions = [];

        foreach (glob("{$projectRoot}/".self::MIGRATED_LISTS.'/*.php') ?: [] as $list) {
            /** @var list<string> $listed */
            $listed = require $list;
            array_push($transitions, ...$listed);
        }

        sort($transitions);

        return $transitions;
    }

    /**
     * Each call of a migrated transition from outside a unit, with the caller's file, line and the transition.
     *
     * @param  list<string>  $folders
     * @return list<string>
     */
    public function violationsIn(array $folders): array
    {
        if ($this->transitions === []) {
            return [];
        }

        $violations = [];
        $byFile = ScanCache::findingsByFile(new TransitionCallScan($this->transitions), DomainFiles::in($folders));

        foreach ($byFile as $path => $calls) {
            $relative = substr($path, strlen($this->projectRoot) + 1);

            foreach ($calls as $call) {
                $transition = $this->transitionOf($call);
                $caller = $transition === null ? null : $this->outsideUnit($relative, $call['type']);

                if ($transition !== null && $caller !== null) {
                    $violations[] = "{$relative}:{$call['line']} {$call['site']} calls {$transition}, which raises a "
                        ."fact, from {$caller}; call it from a command handler or a required listener";
                }
            }
        }

        return $violations;
    }

    /**
     * The migrated transition the call runs, read from the receiver's class; a receiver whose class the code does not
     * show runs none, since a method name alone is shared by many classes.
     *
     * @param  TransitionCall  $call
     */
    private function transitionOf(array $call): string|null
    {
        if ($call['receiver'] === null) {
            return null;
        }

        $receiver = ModelWriteScan::shortName($call['receiver']);

        foreach ($this->transitions as $transition) {
            [$class, $method] = explode('::', $transition) + [1 => ''];

            if ($method === $call['method'] && $receiver === $class) {
                return $transition;
            }
        }

        return null;
    }

    /**
     * What the caller is when it stands outside every unit, or null when a unit holds it.
     */
    private function outsideUnit(string $path, string $type): string|null
    {
        $reflection = class_exists($type) ? new ReflectionClass($type) : null;
        $isModel = $reflection !== null && $reflection->isSubclassOf(Model::class);
        $isRequired = $reflection !== null && $reflection->getAttributes($this->requiredListenerAttribute) !== [];

        return match (true) {
            $isModel, $isRequired => null,
            str_contains($path, '/Listeners/') => 'a public listener',
            $reflection?->implementsInterface(EngineListener::class) === true => 'an engine tick listener',
            str_contains($path, '/Jobs/') => 'a queued job',
            str_contains($path, '/Console/') => 'a console command',
            str_contains($path, '/Http/') => 'a controller',
            isset($this->reach[$path]) => null,
            default => 'code no command handler reaches',
        };
    }
}
