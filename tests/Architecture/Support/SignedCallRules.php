<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\AgentRequests\Contracts\JournalCall;
use App\AgentRequests\Enums\CallEffect;
use App\AgentRequests\Support\CallDeclaration;
use ReflectionClass;
use ReflectionNamedType;
use ReflectionProperty;

/**
 * The checks every signed call and its controller pass, each over the classes it is given, so a test can run it on
 * the project and on a planted case alike.
 */
final readonly class SignedCallRules
{
    /**
     * The property names that name an agent, a session or a user, which only the agent's own code may carry.
     */
    private const array ACTOR_ID_NAMES = ['agentId', 'sessionId', 'userId'];

    /**
     * The controllers whose first parameter is not their call, or whose return type is not its declared answer.
     *
     * @param  list<class-string>  $controllers
     * @return list<string>
     */
    public static function controllersNotTakingTheirCall(array $controllers): array
    {
        $wrong = [];

        foreach ($controllers as $controller) {
            $invoke = new ReflectionClass($controller)->getMethod('__invoke');
            $first = ($invoke->getParameters()[0] ?? null)?->getType();
            $returned = $invoke->getReturnType();
            $call = $first instanceof ReflectionNamedType ? $first->getName() : '';

            if (! is_subclass_of($call, JournalCall::class)) {
                $wrong[] = "{$controller}: its first parameter is no call";

                continue;
            }

            $answer = CallDeclaration::of($call)->endpoint->answer;

            if (! $returned instanceof ReflectionNamedType || $returned->getName() !== $answer) {
                $wrong[] = "{$controller}: it does not return {$answer}";
            }
        }

        return $wrong;
    }

    /**
     * The calls whose @implements JournalCall<X> names another class than their endpoint's answer.
     *
     * @param  list<class-string>  $calls
     * @return list<string>
     */
    public static function callsAnsweringOtherThanTheyImplement(array $calls): array
    {
        $wrong = [];

        foreach ($calls as $call) {
            $class = new ReflectionClass($call);
            preg_match('/@implements\s+JournalCall<(\w+)>/', (string) $class->getDocComment(), $implemented);
            $answer = CallDeclaration::of($call)->endpoint->answer;

            if (($implemented[1] ?? '') !== new ReflectionClass($answer)->getShortName()) {
                $wrong[] = $call;
            }
        }

        return $wrong;
    }

    /**
     * The call and answer properties named for an agent, a session or a user.
     *
     * @param  list<class-string>  $classes
     * @return list<string>
     */
    public static function actorIdProperties(array $classes): array
    {
        $found = [];

        foreach ($classes as $class) {
            foreach (new ReflectionClass($class)->getProperties(ReflectionProperty::IS_PUBLIC) as $property) {
                if (in_array($property->getName(), self::ACTOR_ID_NAMES, true)) {
                    $found[] = "{$class}::\${$property->getName()}";
                }
            }
        }

        return $found;
    }

    /**
     * The write calls a read-only command's source names, by class or by its group method.
     *
     * @param  array<string, string>  $commandSources  source by command class
     * @param  list<class-string>  $calls
     * @return list<string>
     */
    public static function writesOfReadCommands(array $commandSources, array $calls): array
    {
        $writes = array_filter(
            $calls,
            fn (string $call): bool => CallDeclaration::of($call)->endpoint->effect !== CallEffect::Read,
        );
        $found = [];

        foreach ($commandSources as $command => $source) {
            foreach ($writes as $write) {
                $short = new ReflectionClass($write)->getShortName();
                $method = lcfirst(substr($short, 0, -strlen('Call')));

                if (str_contains($source, $short) || str_contains($source, "->{$method}(")) {
                    $found[] = "{$command} uses {$short}";
                }
            }
        }

        return $found;
    }
}
