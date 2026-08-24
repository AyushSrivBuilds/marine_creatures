import {sampleJellyfish} from '../anatomy/sampler';
import type {AnatomySample} from '../anatomy/types';

export const generateJellyfish=(count:number,appendages:number):AnatomySample[]=>sampleJellyfish(count,appendages);
