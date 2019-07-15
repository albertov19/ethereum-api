import * as React from "react";
import styled from "styled-components";
import { fonts, colors } from "../styles";

const SBannerWrapper = styled.div`
  display: flex;
  align-items: center;
  position: relative;
  & span {
    color: rgb(${colors.lightBlue});
    font-weight: ${fonts.weight.bold};
    font-size: ${fonts.size.h5};
    margin-left: 12px;
  }
`;

const Banner = () => (
  <SBannerWrapper>
    <span>{`Web3Connect`}</span>
  </SBannerWrapper>
);

export default Banner;