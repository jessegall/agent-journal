<?php

declare(strict_types=1);

namespace Tests\Unit\Support;

use App\Commands\Layouts\SaveLayout\SaveLayoutCommand;
use App\Commands\Messages\SendMessage\SendMessageCommand;
use Error;
use ReflectionAttribute;
use ReflectionObject;
use Tests\Support\Entries\Attributes\TestsCommand;
use Tests\Support\Entries\Attributes\TestsRoute;
use Tests\TestCase;

/**
 * A test class names several route methods with one repeated attribute each, while a command is named once: PHP refuses
 * a second command attribute on one class.
 */
final class EntryAttributesTest extends TestCase
{
    public function test_two_route_attributes_on_one_class_read_back_as_two(): void
    {
        $test = new #[TestsRoute('GET', 'chat.show')] #[TestsRoute('POST', 'chat.send')] class {};

        $routes = array_map(
            fn (ReflectionAttribute $attribute) => $attribute->newInstance(),
            new ReflectionObject($test)->getAttributes(TestsRoute::class),
        );

        $this->assertEquals([new TestsRoute('GET', 'chat.show'), new TestsRoute('POST', 'chat.send')], $routes);
    }

    public function test_two_command_attributes_on_one_class_are_refused(): void
    {
        $test = new #[TestsCommand(SendMessageCommand::class)] #[TestsCommand(SaveLayoutCommand::class)] class {};

        $this->assertThrows(
            fn () => new ReflectionObject($test)->getAttributes(TestsCommand::class)[0]->newInstance(),
            Error::class,
        );
    }
}
