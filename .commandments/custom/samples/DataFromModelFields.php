<?php

declare(strict_types=1);

namespace App\Samples;

use Illuminate\Database\Eloquent\Model;
use Spatie\LaravelData\Data;

/**
 * A suggestion built field by field from the model that holds the values, which the data-from-model-fields rule finds,
 * beside the model handed to the Data class whose factory maps it, which it passes.
 *
 * @property int $number
 * @property string $title
 */
final class SampleRecordModel extends Model
{
    public function looseSuggestion(): SampleSuggestion
    {
        // @sin DataFromModelFieldsDetector
        return SampleSuggestion::from([
            'number' => (string) $this->number,
            'title' => $this->title,
        ]);
    }

    public function builtSuggestion(): SampleSuggestion
    {
        // @sin DataBuiltFromModelFieldsDetector
        return new SampleSuggestion((string) $this->number, $this->title);
    }

    public function suggestion(): SampleSuggestion
    {
        // @righteous DataFromModelFieldsDetector
        return SampleSuggestion::from($this);
    }

    public function titleOnly(): SampleSuggestion
    {
        // @righteous DataFromModelFieldsDetector
        return SampleSuggestion::from(['number' => '0', 'title' => $this->title]);
    }
}

/**
 * The suggestion a record makes, and the one place that knows how a record becomes it.
 */
final class SampleSuggestion extends Data
{
    public function __construct(public readonly string $number, public readonly string $title) {}

    public static function fromSampleRecordModel(SampleRecordModel $record): self
    {
        return new self((string) $record->number, $record->title);
    }
}
