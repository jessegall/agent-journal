<?php

declare(strict_types=1);

namespace Tests\Unit\Registries;

use App\Hooks\Exceptions\StateTypeRepeated;
use App\Hooks\Exceptions\StateTypeUnknown;
use App\Registries\Support\Registry;
use PHPUnit\Framework\TestCase;

/**
 * The one keyed store: a missing key and, when repeats are refused, a key put twice fail with the owner's own named
 * exceptions; a replacing store keeps the newer item.
 */
final class RegistryTest extends TestCase
{
    public function test_a_missing_key_fails_with_the_owners_exception(): void
    {
        $registry = Registry::once(StateTypeUnknown::forKey(...), StateTypeRepeated::forKey(...));

        $this->assertFalse($registry->has('chat.answering'));
        $this->assertTrue($registry->find('chat.answering')->isEmpty());
        $this->expectException(StateTypeUnknown::class);

        $registry->get('chat.answering');
    }

    public function test_a_store_that_refuses_repeats_refuses_a_key_put_twice(): void
    {
        $registry = Registry::once(StateTypeUnknown::forKey(...), StateTypeRepeated::forKey(...));
        $registry->put('chat.answering', 'first');

        $this->assertSame(['chat.answering'], $registry->keys());
        $this->expectException(StateTypeRepeated::class);

        $registry->put('chat.answering', 'second');
    }

    public function test_a_replacing_store_keeps_the_newer_item_and_forgets_what_is_removed(): void
    {
        $registry = Registry::replacing(StateTypeUnknown::forKey(...));
        $registry->put('one', 1);
        $registry->put('one', 2);
        $registry->put('two', 3);
        $registry->remove('two');

        $this->assertSame(['one' => 2], $registry->all());

        $registry->clear();

        $this->assertSame([], $registry->all());
    }
}
