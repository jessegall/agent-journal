<?php

declare(strict_types=1);

namespace Tests\Unit\CommandLines;

use App\Processes\AnyContext;
use App\Processes\Argument;
use App\Processes\ArgumentBuilder;
use App\Processes\Contracts\Condition;
use App\Processes\Exceptions\CommandLineEmpty;
use stdClass;
use Tests\TestCase;

/**
 * A declared command line keeps its order, applies each rule while its condition holds, fills options from the
 * context and refuses a line with no word.
 */
final class ArgumentBuilderTest extends TestCase
{
    public function test_each_rule_adds_its_words_in_order_while_its_condition_holds(): void
    {
        $context = $this->context(isLoud: true, name: 'Ada');

        $this->journal->assertResult(
            ['greet', '--loud', 'hello', 'Ada', '--name', 'Ada', 'end'],
            $this->builder()->build($context),
        );
    }

    public function test_a_rule_whose_condition_fails_and_an_option_with_no_value_add_nothing(): void
    {
        $context = $this->context(isLoud: false, name: null);

        $this->journal->assertResult(['greet', '--quiet', 'hello', 'nobody', 'end'], $this->builder()->build($context));
    }

    public function test_a_value_in_a_filled_option_is_kept_as_typed(): void
    {
        $context = $this->context(isLoud: false, name: '{value}');

        $this->journal->assertResult(
            ['greet', '--quiet', 'hello', '{value}', '--name', '{value}', 'end'],
            $this->builder()->build($context),
        );
    }

    public function test_a_line_with_no_word_is_refused(): void
    {
        $empty = new readonly class extends ArgumentBuilder
        {
            protected function arguments(): array
            {
                return [Argument::option(['--name', '{value}'], fn (stdClass $context): string|null => null)];
            }
        };

        $this->journal->assertRefused(CommandLineEmpty::class, fn () => $empty->build(new stdClass()));
    }

    private function context(bool $isLoud, string|null $name): stdClass
    {
        $context = new stdClass();
        $context->isLoud = $isLoud;
        $context->name = $name;

        return $context;
    }

    /**
     * @return ArgumentBuilder<stdClass>
     */
    private function builder(): ArgumentBuilder
    {
        $loud = new readonly class implements Condition
        {
            public function holdsFor(object $context): bool
            {
                return $context->isLoud === true;
            }
        };

        return new readonly class($loud) extends ArgumentBuilder
        {
            public function __construct(private Condition $loud) {}

            protected function arguments(): array
            {
                return [
                    Argument::for(new AnyContext(), 'greet'),
                    Argument::for($this->loud, '--loud'),
                    Argument::unless($this->loud, ['--quiet']),
                    Argument::for(new AnyContext(), fn (stdClass $context) => [
                        'hello',
                        $context->name ?? 'nobody',
                    ]),
                    Argument::option(['--name', '{value}'], fn (stdClass $context): string|null => $context->name),
                    Argument::for(new AnyContext(), 'end'),
                ];
            }
        };
    }
}
