<?php

declare(strict_types=1);

namespace Tests\Unit\Settings;

use App\Contracts\Settings\Setting;
use App\Declarations\ChoiceSetting;
use App\Exceptions\SettingStorageInvalid;
use App\Exceptions\SettingValueInvalid;
use App\Support\SettingCodec;
use App\Support\Storage\EncodedValue;
use App\Values\Choice;
use App\Values\Decimal;
use Closure;
use PHPUnit\Framework\Attributes\DataProvider;
use Tests\Fixtures\Domains\Reviews\Enums\ReviewLevel;
use Tests\Fixtures\Domains\Reviews\Enums\ReviewMode;
use Tests\Fixtures\Domains\Reviews\Settings\ReviewSettings;
use Tests\TestCase;

/**
 * Every setting type is stored and read back exactly, a stored value of another type or outside the declaration is
 * refused when read, and a value the declaration does not accept is refused before it is stored.
 */
final class SettingCodecTest extends TestCase
{
    private SettingCodec $codec;

    private ReviewSettings $settings;

    protected function setUp(): void
    {
        parent::setUp();

        $this->codec = new SettingCodec();
        $this->settings = new ReviewSettings();
    }

    public function test_every_type_round_trips_its_default_and_a_bound_value(): void
    {
        $settings = $this->settings;

        foreach (['Reviews', ' spaced ', str_repeat('é', 10)] as $text) {
            $this->assertSame(
                $text,
                $this->codec->decode(
                    'Reviews',
                    $settings->title,
                    $this->codec->encodeString('Reviews', $settings->title, $text),
                ),
            );
        }

        foreach ([true, false] as $flag) {
            $this->assertSame(
                $flag,
                $this->codec->decode('Reviews', $settings->notifyOwner, $this->codec->encodeBoolean($flag)),
            );
        }

        foreach ([3, 0, 10] as $number) {
            $this->assertSame(
                $number,
                $this->codec->decode(
                    'Reviews',
                    $settings->retryLimit,
                    $this->codec->encodeInteger('Reviews', $settings->retryLimit, $number),
                ),
            );
        }

        foreach (['0.50', '999.99', '1'] as $text) {
            $decoded = $this->codec->decode(
                'Reviews',
                $settings->weight,
                $this->codec->encodeDecimal('Reviews', $settings->weight, Decimal::parse($text)),
            );
            $this->assertInstanceOf(Decimal::class, $decoded);
            $this->assertSame(Decimal::parse($text)->toScale(2)->text, $decoded->text);
        }

        foreach (['short', 'long'] as $style) {
            $this->assertSame(
                $style,
                $this->codec->decode(
                    'Reviews',
                    $settings->summaryStyle,
                    $this->codec->encodeOption('Reviews', $settings->summaryStyle, $style),
                ),
            );
        }

        foreach ([0, 1] as $priority) {
            $this->assertSame(
                $priority,
                $this->codec->decode(
                    'Reviews',
                    $settings->priority,
                    $this->codec->encodeOption('Reviews', $settings->priority, $priority),
                ),
            );
        }

        foreach (ReviewMode::cases() as $mode) {
            $this->assertSame(
                $mode,
                $this->codec->decode(
                    'Reviews',
                    $settings->reviewMode,
                    $this->codec->encodeEnum('Reviews', $settings->reviewMode, $mode),
                ),
            );
        }

        foreach (ReviewLevel::cases() as $level) {
            $this->assertSame(
                $level,
                $this->codec->decode(
                    'Reviews',
                    $settings->reviewLevel,
                    $this->codec->encodeEnum('Reviews', $settings->reviewLevel, $level),
                ),
            );
        }
    }

    public function test_text_choices_keep_their_exact_text(): void
    {
        $setting = ChoiceSetting::make(
            'code',
            'Code',
            '01',
            [Choice::make('01', 'Zero one'), Choice::make('1', 'One')],
        );

        $this->assertSame(
            '01',
            $this->codec->decode('Reviews', $setting, $this->codec->encodeOption('Reviews', $setting, '01')),
        );
        $this->assertSame(
            '1',
            $this->codec->decode('Reviews', $setting, $this->codec->encodeOption('Reviews', $setting, '1')),
        );
    }

    public function test_an_int_backed_enum_is_stored_as_its_number_and_read_as_its_case(): void
    {
        $this->assertTrue(
            EncodedValue::of(2)->equals(
                $this->codec->encodeEnum('Reviews', $this->settings->reviewLevel, ReviewLevel::SecondPass),
            ),
        );
        $this->assertSame(
            ReviewLevel::SecondPass,
            $this->codec->decode('Reviews', $this->settings->reviewLevel, EncodedValue::of(2)),
        );
    }

    /**
     * @return array<string, array{string, mixed}>
     */
    public static function storedValuesOfTheWrongType(): array
    {
        return [
            'true for an integer' => ['retryLimit', true],
            'a fraction for an integer' => ['retryLimit', 1.5],
            'an integer past the bound' => ['retryLimit', 11],
            "'0' for an integer choice" => ['priority', '0'],
            'a number for a text choice' => ['summaryStyle', 1],
            'a JSON array for a text' => ['title', [1, 2]],
            'null for a text' => ['title', null],
            'text shorter than allowed' => ['title', ''],
            "'false' for a boolean" => ['notifyOwner', 'false'],
            '0 for a boolean' => ['notifyOwner', 0],
            '1 for a boolean' => ['notifyOwner', 1],
            'too many fractional digits' => ['weight', '0.101'],
            'a decimal at another scale' => ['weight', '0.5'],
            'a decimal as a number' => ['weight', 0.5],
            'a decimal past its digits' => ['weight', '1000.00'],
            'a case the enum does not have' => ['reviewMode', 'gone'],
            'a backing of the other type' => ['reviewLevel', '1'],
        ];
    }

    #[DataProvider('storedValuesOfTheWrongType')]
    public function test_a_stored_value_its_setting_does_not_accept_is_refused_naming_only_the_setting(
        string $property,
        mixed $stored,
    ): void {
        /**
         * @var Setting $setting
         */
        $setting = $this->settings->{$property};

        $this->expectException(SettingStorageInvalid::class);
        $this->expectExceptionMessage(SettingStorageInvalid::for('Reviews', $setting->key())->getMessage());

        $this->codec->decode('Reviews', $setting, EncodedValue::of($stored));
    }

    public function test_a_toggle_is_only_a_json_boolean(): void
    {
        $this->assertTrue($this->codec->decodeToggle('Reviews', $this->settings->review, EncodedValue::of(true)));
        $this->assertFalse($this->codec->decodeToggle('Reviews', $this->settings->review, EncodedValue::of(false)));

        $this->expectException(SettingStorageInvalid::class);

        $this->codec->decodeToggle('Reviews', $this->settings->review, EncodedValue::of(1));
    }

    /**
     * @return array<string, array{Closure(SettingCodec, ReviewSettings): EncodedValue, string}>
     */
    public static function valuesOneStepPastABound(): array
    {
        return [
            'an integer above its maximum' => [
                fn (
                    SettingCodec $codec,
                    ReviewSettings $settings,
                ) => $codec->encodeInteger('Reviews', $settings->retryLimit, 11),
                'retryLimit',
            ],
            'an integer below its minimum' => [
                fn (
                    SettingCodec $codec,
                    ReviewSettings $settings,
                ) => $codec->encodeInteger('Reviews', $settings->retryLimit, -1),
                'retryLimit',
            ],
            'a decimal past its scale' => [
                fn (
                    SettingCodec $codec,
                    ReviewSettings $settings,
                ) => $codec->encodeDecimal(
                    'Reviews',
                    $settings->weight,
                    Decimal::parse('0.501'),
                ),
                'weight',
            ],
            'a decimal past its digits' => [
                fn (
                    SettingCodec $codec,
                    ReviewSettings $settings,
                ) => $codec->encodeDecimal(
                    'Reviews',
                    $settings->weight,
                    Decimal::parse('1000'),
                ),
                'weight',
            ],
            'text shorter than allowed' => [
                fn (
                    SettingCodec $codec,
                    ReviewSettings $settings,
                ) => $codec->encodeString(
                    'Reviews',
                    $settings->title,
                    '',
                ),
                'title',
            ],
            'a choice not among the options' => [
                fn (
                    SettingCodec $codec,
                    ReviewSettings $settings,
                ) => $codec->encodeOption(
                    'Reviews',
                    $settings->priority,
                    2,
                ),
                'priority',
            ],
            'a choice of the other type' => [
                fn (
                    SettingCodec $codec,
                    ReviewSettings $settings,
                ) => $codec->encodeOption(
                    'Reviews',
                    $settings->priority,
                    '1',
                ),
                'priority',
            ],
            'a case of another enum' => [
                fn (
                    SettingCodec $codec,
                    ReviewSettings $settings,
                ) => $codec->encodeEnum(
                    'Reviews',
                    $settings->reviewLevel,
                    ReviewMode::Quick,
                ),
                'reviewLevel',
            ],
        ];
    }

    /**
     * @param  Closure(SettingCodec, ReviewSettings): EncodedValue  $encode
     */
    #[DataProvider('valuesOneStepPastABound')]
    public function test_a_value_the_setting_does_not_accept_is_refused_naming_the_key_never_the_value(
        Closure $encode,
        string $property,
    ): void {
        /**
         * @var Setting $setting
         */
        $setting = $this->settings->{$property};

        $this->expectException(SettingValueInvalid::class);
        $this->expectExceptionMessage(
            SettingValueInvalid::for('Reviews', $setting->key(), $setting->type())->getMessage(),
        );

        $encode($this->codec, $this->settings);
    }
}
