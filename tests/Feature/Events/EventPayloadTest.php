<?php

declare(strict_types=1);

namespace Tests\Feature\Events;

use App\Contracts\Asks\AnsweredAtOnce;
use App\Support\DeclaredType;
use App\Support\ReflectedMethod;
use App\Support\ReflectedType;
use Closure;
use Domain\Plans\PlansDomain;
use Domain\Tasks\TasksDomain;
use Illuminate\Contracts\Container\Container;
use Illuminate\Database\Eloquent\Model;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Support\DomainBoot;
use Tests\TestCase;

/**
 * Every published fact keeps its shape: its fields and their types, actor fields included, its delivery after the
 * commit, and a payload a queue can carry.
 */
final class EventPayloadTest extends TestCase
{
    /**
     * The domains this test uses beside core.
     */
    protected static function bootedDomains(): array
    {
        return DomainBoot::withRequirements(PlansDomain::class, TasksDomain::class);
    }

    /**
     * The kinds a fact's payload may not hold anywhere inside it.
     */
    private const array UNQUEUEABLE = [Model::class, Container::class, Closure::class];

    /**
     * @return iterable<string, array{class-string, array<string, string>}>
     */
    public static function facts(): iterable
    {
        foreach (EventPayloads::facts() as $event => $shape) {
            $name = class_basename($event).' keeps its fields';

            yield $name => [$event, $shape['fields']];
        }
    }

    /**
     * @param  class-string  $event
     * @param  array<string, string>  $fields
     */
    #[DataProvider('facts')]
    public function test_a_fact_keeps_its_published_shape(string $event, array $fields): void
    {
        $declaration = ReflectedType::of($event);
        $declared = [];
        $parameters = $declaration->constructor()
            ->map(fn (ReflectedMethod $constructor) => $constructor->parameters())
            ->getOrElse([]);

        foreach ($parameters as $parameter) {
            $declared[$parameter->name()] = $parameter->type()
                ->map(fn (DeclaredType $type) => $type->text)
                ->getOrElse('');
        }

        $this->assertSame($fields, $declared);
        // A published fact is heard after its command commits, never as a question answered at once.
        $this->assertFalse($declaration->implements(AnsweredAtOnce::class));
        $this->assertSame([], $this->unqueueableTypesIn($event, []));
    }

    public function test_requests_and_projections_are_named_and_skipped(): void
    {
        $this->assertSame(
            ['request', 'projection'],
            array_values(array_unique(array_values(EventPayloads::skipped()))),
        );
        $this->assertSame([], array_intersect_key(EventPayloads::skipped(), EventPayloads::facts()));
    }

    /**
     * The classes inside the type, its value objects' properties followed, that a queued payload cannot carry.
     *
     * @param  list<string>  $seen
     * @return list<string>
     */
    private function unqueueableTypesIn(string $type, array $seen): array
    {
        $declaration = ReflectedType::find($type)->filter(fn (ReflectedType $found) => $found->isClass());

        if (in_array($type, $seen, true) || $declaration->isEmpty()) {
            return [];
        }

        $found = array_values(array_filter(self::UNQUEUEABLE, fn (string $kind) => $declaration->get()->is($kind)));

        if ($found !== [] || ! (str_starts_with($type, 'App\\') || str_starts_with($type, 'Domain\\'))) {
            return $found === [] ? [] : [$type];
        }

        $inside = [];

        foreach ($declaration->get()->properties() as $property) {
            $propertyType = $property->type()
                ->filter(fn (DeclaredType $declared) => $declared->isNamed() && ! $declared->isBuiltin());

            if ($propertyType->isDefined()) {
                array_push($inside, ...$this->unqueueableTypesIn($propertyType->get()->name(), [...$seen, $type]));
            }
        }

        return $inside;
    }
}
