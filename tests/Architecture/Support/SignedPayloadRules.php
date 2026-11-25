<?php

declare(strict_types=1);

namespace Tests\Architecture\Support;

use App\Contracts\Domains\ApiPayload;
use App\Enums\Processes\ApiEffect;
use App\Support\ApiDeclaration;
use App\Support\DeclaredType;
use App\Support\ReflectedType;
use PhpOption\Option;

/**
 * The checks every signed call and its controller pass, each over the classes it is given, so a test can run it on
 * the project and on a planted case alike.
 */
final readonly class SignedPayloadRules
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
            $controllerMethod = ReflectedType::of($controller)->method('__invoke');
            $parameters = $controllerMethod->parameters();
            $call = $parameters === [] ? '' : self::namedTypeOf($parameters[0]->type());

            if (! ReflectedType::exists($call) || ! ReflectedType::of($call)->isSubclassOf(ApiPayload::class)) {
                $wrong[] = "{$controller}: its first parameter is no call";

                continue;
            }

            $answer = ApiDeclaration::of($call)->endpoint->answer;

            if (self::namedTypeOf($controllerMethod->returnType()) !== $answer) {
                $wrong[] = "{$controller}: it does not return {$answer}";
            }
        }

        return $wrong;
    }

    /**
     * The calls whose @implements ApiPayload<X> names another class than their endpoint's answer.
     *
     * @param  list<class-string>  $calls
     * @return list<string>
     */
    public static function callsAnsweringOtherThanTheyImplement(array $calls): array
    {
        $wrong = [];

        foreach ($calls as $call) {
            $docblock = ReflectedType::of($call)->docComment()->getOrElse('');
            preg_match('/@implements\s+ApiPayload<(\w+)>/', $docblock, $callContractMatch);
            $answer = ApiDeclaration::of($call)->endpoint->answer;

            if (($callContractMatch[1] ?? '') !== ReflectedType::of($answer)->shortName()) {
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
            foreach (ReflectedType::of($class)->properties() as $property) {
                if ($property->isPublic() && in_array($property->name(), self::ACTOR_ID_NAMES, true)) {
                    $found[] = "{$class}::\${$property->name()}";
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
            fn (string $call): bool => ApiDeclaration::of($call)->endpoint->effect !== ApiEffect::Read,
        );
        $found = [];

        foreach ($commandSources as $command => $source) {
            foreach ($writes as $write) {
                $short = ReflectedType::of($write)->shortName();
                $method = lcfirst(substr($short, 0, -strlen('Payload')));

                if (str_contains($source, $short) || str_contains($source, "->{$method}(")) {
                    $found[] = "{$command} uses {$short}";
                }
            }
        }

        return $found;
    }

    /**
     * The one name of a declared type; empty for none, a union or an intersection.
     *
     * @param  Option<DeclaredType>  $type
     */
    private static function namedTypeOf(Option $type): string
    {
        return $type->filter(fn (DeclaredType $declared) => $declared->isNamed())
            ->map(fn (DeclaredType $declared) => $declared->name())
            ->getOrElse('');
    }
}
