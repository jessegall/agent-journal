<?php

declare(strict_types=1);

namespace Tests\Unit\Bus;

use App\Actors\Support\ActorContext;
use App\Bus\Exceptions\CommandDispatcherMissing;
use App\Bus\Support\Command;
use App\Bus\Support\CommandGrammar;
use App\Bus\Support\PlainValue;
use PHPUnit\Framework\TestCase;
use ReflectionClass;
use ReflectionMethod;
use ReflectionProperty;
use Tests\Fixtures\Bus\Proof\BoundItem;

/**
 * The base command binds its dispatcher by clone-with on PHP 8.5: a bound copy keeps the exact actor, the original
 * stays unbound, and the private slot never shows in reflection, public fields or fingerprints.
 */
final class CommandBaseTest extends TestCase
{
    public function test_first_binding_keeps_the_exact_actor_and_leaves_the_original_unbound(): void
    {
        $item = new BoundItem('Seeds', 3);
        $agent = ActorContext::forAgent('agent-1');

        $bound = $item->withDispatcher($agent);

        $this->assertInstanceOf(BoundItem::class, $bound);
        $this->assertNotSame($item, $bound);
        $this->assertSame($agent, $bound->dispatchedBy());
        $this->expectException(CommandDispatcherMissing::class);
        $item->dispatchedBy();
    }

    public function test_rebinding_a_bound_copy_keeps_the_first_copy_and_every_business_value(): void
    {
        $item = new BoundItem('Seeds', 3);
        $agent = ActorContext::forAgent('agent-1');
        $user = ActorContext::forUser('user-1');

        $bound = $item->withDispatcher($agent);
        $rebound = $bound->withDispatcher($user);

        $this->assertSame($user, $rebound->dispatchedBy());
        $this->assertSame($agent, $bound->dispatchedBy());

        foreach ([$bound, $rebound] as $copy) {
            $this->assertSame('Seeds', $copy->title);
            $this->assertSame(3, $copy->quantity);
        }
    }

    public function test_the_private_slot_is_absent_from_grammar_reflection_public_fields_and_fingerprints(): void
    {
        $item = new BoundItem('Seeds', 3);
        $bound = $item->withDispatcher(ActorContext::forAgent('agent-1'));
        $properties = array_map(
            fn (ReflectionProperty $property): string => $property->getName(),
            new ReflectionClass(BoundItem::class)->getProperties(),
        );
        $grammar = new CommandGrammar(fn (string $class): bool => true);

        $this->assertSame(['title', 'quantity'], $properties);
        $this->assertNull($grammar->problemWithProperties(BoundItem::class));
        $this->assertSame(['title' => 'Seeds', 'quantity' => 3], get_object_vars($bound));
        $this->assertSame(PlainValue::of($item), PlainValue::of($bound));
        $this->assertSame(PlainValue::fingerprintOf($item), PlainValue::fingerprintOf($bound));
    }

    public function test_the_lifecycle_methods_are_final_and_an_unbound_read_names_the_command(): void
    {
        $this->assertTrue(new ReflectionMethod(Command::class, 'dispatchedBy')->isFinal());
        $this->assertTrue(new ReflectionMethod(Command::class, 'withDispatcher')->isFinal());
        $this->assertTrue(new ReflectionProperty(Command::class, 'dispatchingActor')->isPrivate());

        $this->expectException(CommandDispatcherMissing::class);
        $this->expectExceptionMessage(BoundItem::class);
        new BoundItem('Seeds', 3)->dispatchedBy();
    }
}
