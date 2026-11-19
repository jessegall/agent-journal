<?php

declare(strict_types=1);

namespace Tests\Unit\Settings;

use App\Settings\Data\BooleanValueData;
use App\Settings\Data\DecimalConstraintsData;
use App\Settings\Data\DecimalValueData;
use App\Settings\Data\IntegerChoiceConstraintsData;
use App\Settings\Data\IntegerChoiceValueData;
use App\Settings\Data\InvalidValueData;
use App\Settings\Data\PlainGroupAvailabilityData;
use App\Settings\Data\SettingIdentityData;
use App\Settings\Data\SettingsCatalogueData;
use App\Settings\Data\ToggleGroupAvailabilityData;
use App\Settings\Enums\GroupAvailability;
use App\Settings\Enums\SettingAvailability;
use App\Settings\Enums\SettingSource;
use App\Settings\Enums\SettingType;
use ReflectionClass;
use ReflectionNamedType;
use ReflectionType;
use ReflectionUnionType;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Tests\TestCase;

/**
 * The catalogue's Data keep honest types on the wire: booleans stay booleans, decimals are text, whole-number choices
 * are numbers, each variant names its type, an absent value is left out, and no property is an untyped bag.
 */
final class SettingsCatalogueDataTest extends TestCase
{
    public function test_a_catalogue_keeps_every_value_its_own_type_on_the_wire(): void
    {
        $catalogue = SettingsCatalogueData::from([
            'owner' => 'Reviews',
            'title' => 'Settings',
            'revision' => 3,
            'groups' => [
                [
                    'identity' => $this->identity('review'),
                    'label' => 'Review',
                    'availability' => ToggleGroupAvailabilityData::from(
                        ['state' => GroupAvailability::Disabled, 'defaultEnabled' => true],
                    ),
                    'settings' => [
                        [
                            'identity' => $this->identity('notify_owner'),
                            'label' => 'Notify the owner',
                            'type' => SettingType::Boolean,
                            'source' => SettingSource::Override,
                            'availability' => SettingAvailability::GroupDisabled,
                            'default' => BooleanValueData::from(['value' => true]),
                            'configured' => BooleanValueData::from(['value' => false]),
                        ],
                        [
                            'identity' => $this->identity('weight'),
                            'label' => 'Weight',
                            'type' => SettingType::Decimal,
                            'source' => SettingSource::Override,
                            'availability' => SettingAvailability::GroupDisabled,
                            'default' => DecimalValueData::from(['value' => '0.50']),
                            'constraints' => DecimalConstraintsData::from(
                                ['precision' => 5, 'scale' => 2],
                            ),
                            'configured' => InvalidValueData::from([]),
                        ],
                    ],
                ],
                [
                    'identity' => $this->identity('general'),
                    'label' => 'General',
                    'availability' => PlainGroupAvailabilityData::from([]),
                    'settings' => [
                        [
                            'identity' => $this->identity('priority'),
                            'label' => 'Priority',
                            'type' => SettingType::Choice,
                            'source' => SettingSource::Default,
                            'availability' => SettingAvailability::Available,
                            'default' => IntegerChoiceValueData::from(['value' => 0]),
                            'constraints' => IntegerChoiceConstraintsData::from(
                                [
                                    'options' => [
                                        ['value' => 0, 'label' => 'Normal'],
                                    ],
                                ],
                            ),
                        ],
                    ],
                ],
            ],
        ])->toArray();

        $review = $catalogue['groups'][0];
        $this->assertSame(['state' => 'disabled', 'defaultEnabled' => true], $review['availability']);
        $this->assertSame(['value' => false, 'type' => 'boolean'], $review['settings'][0]['configured']);
        $this->assertSame(['value' => '0.50', 'type' => 'decimal'], $review['settings'][1]['default']);
        $this->assertSame(['type' => 'invalid'], $review['settings'][1]['configured']);
        $this->assertSame(['precision' => 5, 'scale' => 2, 'type' => 'decimal'], $review['settings'][1]['constraints']);

        $priority = $catalogue['groups'][1]['settings'][0];
        $this->assertSame(['state' => 'always'], $catalogue['groups'][1]['availability']);
        $this->assertSame(['value' => 0, 'type' => 'integerChoice'], $priority['default']);
        $this->assertSame([['value' => 0, 'label' => 'Normal']], $priority['constraints']['options']);
        $this->assertArrayNotHasKey('configured', $priority);
        $this->assertSame(
            ['owner' => 'Reviews', 'key' => 'priority', 'canonicalKey' => 'Reviews.priority'],
            $priority['identity'],
        );
    }

    public function test_no_catalogue_property_is_mixed_or_an_untyped_array(): void
    {
        foreach (glob(app_path('Settings/Data/*.php')) ?: [] as $file) {
            $class = new ReflectionClass('App\\Settings\\Data\\'.basename($file, '.php'));
            $this->assertTrue($class->isFinal(), "{$class->getName()} is not final.");

            $ownProperties = array_filter(
                $class->getProperties(),
                fn ($property) => $property->getDeclaringClass()->getName() === $class->getName(),
            );

            foreach ($ownProperties as $property) {
                $names = self::typeNamesOf($property->getType());

                $this->assertNotContains('mixed', $names, "{$class->getName()}::\${$property->getName()} is mixed.");
                $this->assertTrue(
                    $property->isReadOnly(),
                    "{$class->getName()}::\${$property->getName()} is not readonly.",
                );

                if ($names === ['array']) {
                    $this->assertNotSame(
                        [],
                        $property->getAttributes(DataCollectionOf::class),
                        "{$class->getName()}::\${$property->getName()} is an array without its element type.",
                    );
                }
            }
        }
    }

    private function identity(string $key): SettingIdentityData
    {
        return SettingIdentityData::from(['owner' => 'Reviews', 'key' => $key, 'canonicalKey' => "Reviews.{$key}"]);
    }

    /**
     * The names of the types a property declares; an undeclared or intersection type reads as mixed.
     *
     * @return list<string>
     */
    private static function typeNamesOf(ReflectionType|null $type): array
    {
        if ($type instanceof ReflectionUnionType) {
            return array_map(fn (ReflectionNamedType $named) => $named->getName(), $type->getTypes());
        }

        if ($type instanceof ReflectionNamedType) {
            return [$type->getName()];
        }

        return ['mixed'];
    }
}
