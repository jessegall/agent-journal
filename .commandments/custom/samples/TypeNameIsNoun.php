<?php

declare(strict_types=1);

namespace Samples\TypeNameIsNoun;

use Attribute;

// @sin TypeNameIsNounDetector
interface RunsPipelines {}

// @sin TypeNameIsNounDetector
final class SendsMessages {}

// @righteous TypeNameIsNounDetector
interface PipelineRunner {}

// @righteous TypeNameIsNounDetector
trait HasComments {}

// @righteous TypeNameIsNounDetector
#[Attribute]
final class RequiresRequestKey {}

// @righteous TypeNameIsNounDetector
final class ReadsServiceProvider {}

// @righteous TypeNameIsNounDetector
final class Exports {}
