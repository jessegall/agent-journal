<?php

declare(strict_types=1);

namespace Tests\Unit\Settings;

use App\Declarations\BooleanSetting;
use App\Declarations\ChoiceSetting;
use App\Declarations\DecimalSetting;
use App\Declarations\EnumSetting;
use App\Declarations\IntegerSetting;
use App\Enums\SettingType;
use App\Exceptions\SettingDeclarationInvalid;
use App\Support\ChoiceOptions;
use App\Values\Choice;
use App\Values\Decimal;
use Closure;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\Domains\Reviews\Enums\ReviewLevel;
use Tests\Fixtures\Domains\Reviews\Enums\ReviewMode;
use Tests\TestCase;
use TypeError;

/**
 * Each typed setting checks its own declaration and refuses a wrong one naming its key; choices compare exactly.
 */
final class TypedSettingsTest extends TestCase
{
    public function test_valid_declarations_of_every_type_build(): void
    {
        $this->assertSame(SettingType::Boolean, BooleanSetting::make('notify', 'Notify', true)->type());
        $this->assertTrue(IntegerSetting::make('retries', 'Retries', 3, 0, 10)->accepts(10));
        $this->assertSame('0.50', DecimalSetting::make('weight', 'Weight', Decimal::parse('0.5'), 5, 2)->isDefault->text);
    }

    /**
     * @return iterable<string, array{Closure(): mixed}>
     */
    public static function wrongDeclarations(): iterable
    {
        yield 'an integer default outside its bounds' => [fn () => IntegerSetting::make('weight', 'Weight', 11, 0, 10)];

        yield 'a minimum above the maximum' => [fn () => IntegerSetting::make('weight', 'Weight', 5, 10, 0)];

        yield 'a bound past the largest exact number' => [
            fn () => IntegerSetting::make('weight', 'Weight', 0, 0, IntegerSetting::LARGEST + 1),
        ];

        yield 'too many digits' => [
            fn () => DecimalSetting::make('weight', 'Weight', Decimal::parse('1'), DecimalSetting::MOST_DIGITS + 1, 2),
        ];

        yield 'too many fractional digits' => [
            fn () => DecimalSetting::make(
                'weight',
                'Weight',
                Decimal::parse('1'),
                20,
                DecimalSetting::MOST_FRACTIONAL_DIGITS + 1,
            ),
        ];

        yield 'more fractional digits than digits' => [
            fn () => DecimalSetting::make('weight', 'Weight', Decimal::parse('1'), 2, 3),
        ];

        yield 'a decimal default with digits past the scale' => [
            fn () => DecimalSetting::make('weight', 'Weight', Decimal::parse('0.555'), 5, 2),
        ];

        yield 'a choice default not among the options' => [
            fn () => ChoiceSetting::make('weight', 'Weight', 2, [Choice::make(0, 'Low'), Choice::make(1, 'High')]),
        ];

        yield 'text and whole-number options mixed' => [
            fn () => ChoiceSetting::make('weight', 'Weight', 'a', [Choice::make('a', 'A'), Choice::make(1, 'One')]),
        ];

        yield 'no options' => [fn () => ChoiceSetting::make('weight', 'Weight', 'a', [])];

        yield 'one value twice' => [
            fn () => ChoiceSetting::make('weight', 'Weight', 'a', [Choice::make('a', 'A'), Choice::make('a', 'Again')]),
        ];

        yield 'a default of another enum' => [
            fn () => EnumSetting::make('weight', 'Weight', ReviewMode::class, ReviewLevel::FirstPass),
        ];
    }

    /**
     * @param  Closure(): mixed  $declaration
     */
    #[DataProvider('wrongDeclarations')]
    public function test_a_wrong_declaration_is_refused_naming_its_key(Closure $declaration): void
    {
        try {
            $declaration();
            $this->fail('The wrong declaration was accepted.');
        } catch (SettingDeclarationInvalid $refusal) {
            $this->assertStringContainsString('weight', $refusal->getMessage());
        }
    }

    public function test_a_unit_enum_cannot_be_declared(): void
    {
        $this->expectException(TypeError::class);

        EnumSetting::make(
            'weight',
            'Weight',
            SettingTypeUnit::class,
            SettingTypeUnit::One,
        ); // @phpstan-ignore argument.type, argument.templateType
    }

    public function test_a_boolean_default_must_be_a_boolean(): void
    {
        $this->expectException(TypeError::class);

        BooleanSetting::make('x', 'X', isDefault: 0); // @phpstan-ignore argument.type
    }

    public function test_string_choices_compare_exactly(): void
    {
        $setting = ChoiceSetting::make(
            'code',
            'Code',
            '01',
            [Choice::make('01', 'Zero one'), Choice::make('1', 'One')],
        );

        $this->assertCount(2, $setting->options());
        $this->assertTrue($setting->accepts('1'));
        $this->assertFalse($setting->accepts('001'));
    }

    public function test_an_enum_setting_lists_every_case_in_order_with_its_backing(): void
    {
        $mode = EnumSetting::make('mode', 'Mode', ReviewMode::class, ReviewMode::Quick);
        $level = EnumSetting::make('level', 'Level', ReviewLevel::class, ReviewLevel::FirstPass);

        $this->assertSame(SettingType::String, $mode->backing);
        $this->assertSame(
            [['quick', 'A quick look'], ['thorough', 'A thorough review']],
            array_map(fn (Choice $choice) => [$choice->optionKey, $choice->label], $mode->options()),
        );
        $this->assertSame(SettingType::Integer, $level->backing);
        $this->assertSame(
            [[1, 'First Pass'], [2, 'Second Pass']],
            array_map(fn (Choice $choice) => [$choice->optionKey, $choice->label], $level->options()),
        );
        $this->assertSame(ReviewLevel::SecondPass, $level->caseOf(2));
    }

    public function test_choices_past_the_limit_are_refused(): void
    {
        $choices = array_map(fn (int $value) => Choice::make($value, 'Choice'), range(1, ChoiceOptions::MOST + 1));

        $this->expectException(SettingDeclarationInvalid::class);

        ChoiceSetting::make('many', 'Many', 1, $choices);
    }
}

enum SettingTypeUnit
{
    case One;
}
